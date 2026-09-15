import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/admin-session";

// En Next.js 16 el archivo "middleware.ts" fue renombrado a "proxy.ts"
// (la función exportada también cambia de nombre: middleware -> proxy).
// Protege /admin con una sesión real (cookie firmada), no auth básica del
// navegador — ver /admin/login para el formulario.
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const secret = process.env.ADMIN_SESSION_SECRET;
  // Fail-closed: sin secret o muy corto, no permitir bypass silencioso
  if (!secret || secret.length < 32) {
    console.error(
      "ADMIN_SESSION_SECRET faltante o demasiado corto (<32 chars) — bloqueando acceso a /admin",
    );
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const token = req.cookies.get("admin_session")?.value;
  const valid = await verifySessionToken(token, secret);

  if (!valid) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
