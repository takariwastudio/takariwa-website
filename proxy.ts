import { NextRequest, NextResponse } from "next/server";

// En Next.js 16 el archivo "middleware.ts" fue renombrado a "proxy.ts"
// (la función exportada también cambia de nombre: middleware -> proxy).
// Protección mínima para /admin — suficiente para no dejarlo abierto al
// público; no reemplaza un sistema de auth real si el equipo crece.
export function proxy(req: NextRequest) {
  const auth = req.headers.get("authorization");

  if (auth) {
    const [, encoded] = auth.split(" ");
    const [user, pass] = atob(encoded).split(":");
    if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASSWORD) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Autenticación requerida", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Takariwa Admin"' },
  });
}

export const config = {
  matcher: "/admin/:path*",
};
