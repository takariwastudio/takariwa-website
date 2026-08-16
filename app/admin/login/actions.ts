"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionToken } from "@/lib/admin-session";

export interface LoginState {
  error?: string;
}

export async function loginAdmin(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const user = String(formData.get("user") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (
    user !== process.env.ADMIN_USER ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return { error: "Usuario o contraseña incorrectos." };
  }

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    return { error: "Falta configurar ADMIN_SESSION_SECRET en el servidor." };
  }

  const token = await createSessionToken(secret);
  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}
