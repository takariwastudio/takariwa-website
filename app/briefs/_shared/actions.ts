"use server";

import { after } from "next/server";
import { headers } from "next/headers";
import { createServerSupabase } from "@/lib/supabase/server";
import { notifyNewBrief } from "@/lib/email";
import { notifyDiscordBrief } from "@/lib/discord";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  isValidEmail,
  isHoneypotTriggered,
  validateBriefPayloadSize,
  validateContacto,
  validateEmpresa,
} from "@/lib/validation";
import type { BriefFormData, BriefType } from "./types";

export interface SubmitResult {
  ok: boolean;
  error?: string;
}

export async function submitBrief(
  type: BriefType,
  data: BriefFormData,
): Promise<SubmitResult> {
  if (isHoneypotTriggered(data as Record<string, unknown>)) {
    console.warn("Honeypot triggered en submitBrief", { type });
    return { ok: true };
  }

  try {
    const hdrs = await headers();
    const ip =
      hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      hdrs.get("x-real-ip") ||
      "unknown";
    const rl = checkRateLimit(`brief:${type}`, ip, 5, 10 * 60 * 1000);
    if (!rl.allowed) {
      return {
        ok: false,
        error: "Demasiados envíos. Intenta de nuevo en unos minutos.",
      };
    }
  } catch {
    // best-effort
  }

  const empresa = String(data.nombre_marca ?? data.empresa ?? "").trim();
  const contactoNombre = String(data.responsable ?? data.contacto ?? "").trim();
  const email = String(data.email ?? "").trim();

  const empresaErr = validateEmpresa(empresa);
  if (empresaErr) return { ok: false, error: empresaErr };
  const contactoErr = validateContacto(contactoNombre);
  if (contactoErr) return { ok: false, error: contactoErr };
  if (email && !isValidEmail(email)) {
    return { ok: false, error: "El correo electrónico no parece válido." };
  }
  const sizeErr = validateBriefPayloadSize(data);
  if (sizeErr) return { ok: false, error: sizeErr };

  const supabase = createServerSupabase();

  const { data: inserted, error } = await supabase
    .from("briefs")
    .insert({
      type,
      empresa,
      contacto: contactoNombre,
      email: email || null,
      status: "nuevo",
      data,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error guardando brief:", error);
    return {
      ok: false,
      error: "No se pudo guardar el brief. Intenta de nuevo en unos minutos.",
    };
  }

  // No queremos que el usuario espere a que salgan el correo y Discord antes
  // de ver "Listo." — pero tampoco podemos simplemente no esperarlos (void),
  // porque en Vercel la función serverless puede congelarse justo después de
  // responder, matando cualquier trabajo pendiente a mitad de camino. after()
  // es la forma correcta: la plataforma mantiene la ejecución viva hasta que
  // esto termine, sin bloquear la respuesta que ya recibió el usuario.
  after(async () => {
    await Promise.allSettled([
      notifyNewBrief(type, inserted.id, empresa, contactoNombre, email, data),
      notifyDiscordBrief(
        type,
        inserted.id,
        empresa,
        contactoNombre,
        email,
        data,
      ),
    ]);
  });

  return { ok: true };
}
