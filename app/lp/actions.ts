"use server";

import { headers } from "next/headers";
import { notifyNewContact } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  isHoneypotTriggered,
  isValidEmail,
  validateMensaje,
  validateNombre,
  validateTelefono,
} from "@/lib/validation";

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
  payload: ContactPayload & { website?: string; _hp?: string },
): Promise<SubmitResult> {
  if (isHoneypotTriggered(payload as unknown as Record<string, unknown>)) {
    console.warn("Honeypot triggered en submitContact");
    return { ok: true };
  }

  try {
    const hdrs = await headers();
    const ip =
      hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      hdrs.get("x-real-ip") ||
      "unknown";
    const rl = checkRateLimit("contact", ip, 5, 10 * 60 * 1000);
    if (!rl.allowed) {
      return {
        ok: false,
        error: "Demasiados mensajes. Espera unos minutos e intenta de nuevo.",
      };
    }
  } catch {
    // best-effort
  }

  const nombre = payload.nombre.trim();
  const telefono = payload.telefono.trim();
  const email = payload.email.trim();
  const mensaje = payload.mensaje.trim();

  if (!payload.aceptaPolitica) {
    return {
      ok: false,
      error: "Debes aceptar la política de privacidad.",
    };
  }

  const nombreErr = validateNombre(nombre);
  if (nombreErr) return { ok: false, error: nombreErr };
  const telErr = validateTelefono(telefono);
  if (telErr) return { ok: false, error: telErr };
  if (!email || !isValidEmail(email)) {
    return { ok: false, error: "El email no es válido." };
  }
  const msgErr = validateMensaje(mensaje);
  if (msgErr) return { ok: false, error: msgErr };

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
