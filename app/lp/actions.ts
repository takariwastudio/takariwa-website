"use server";

import { notifyNewContact } from "@/lib/email";

export interface SubmitResult {
  ok: boolean;
  error?: string;
}

export interface ContactPayload {
  nombre: string;
  telefono: string;
  email: string;
  mensaje: string;
  aceptaPolitica: boolean;
}

export async function submitContact(
  payload: ContactPayload,
): Promise<SubmitResult> {
  const nombre = payload.nombre.trim();
  const telefono = payload.telefono.trim();
  const email = payload.email.trim();
  const mensaje = payload.mensaje.trim();

  if (!nombre || !telefono || !email || !mensaje || !payload.aceptaPolitica) {
    return {
      ok: false,
      error: "Completa todos los campos y acepta la política de privacidad.",
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "El email no es válido." };
  }

  // A diferencia de los briefs, aquí no hay persistencia en Supabase — el
  // correo ES el registro, así que si falla el envío, se lo decimos al
  // usuario en vez de responder "ok" en falso.
  const result = await notifyNewContact(nombre, telefono, email, mensaje);

  if (!result.sent) {
    return {
      ok: false,
      error: "Hubo un error enviando tu mensaje. Intenta de nuevo.",
    };
  }

  return { ok: true };
}
