"use server";

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

  // No bloqueamos la respuesta al usuario si el correo o Discord tardan o
  // fallan — el brief ya quedó guardado, que es lo que no se puede perder.
  void notifyNewBrief(type, inserted.id, empresa, contactoNombre, email, data);
  void notifyDiscordBrief(
    type,
    inserted.id,
    empresa,
    contactoNombre,
    email,
    data,
  );

  return { ok: true };
}
