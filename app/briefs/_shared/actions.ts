"use server";

import { after } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { notifyNewBrief } from "@/lib/email";
import { notifyDiscordBrief } from "@/lib/discord";
import type { BriefFormData, BriefType } from "./types";

export interface SubmitResult {
  ok: boolean;
  error?: string;
}

export async function submitBrief(
  type: BriefType,
  data: BriefFormData,
): Promise<SubmitResult> {
  const empresa = String(data.nombre_marca ?? data.empresa ?? "").trim();
  const contactoNombre = String(data.responsable ?? data.contacto ?? "").trim();
  const email = String(data.email ?? "").trim();

  if (!empresa) {
    return { ok: false, error: "Falta el nombre de la marca/empresa." };
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "El correo electrónico no parece válido." };
  }

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
