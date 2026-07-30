"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { notifyNewBrief } from "@/lib/email";
import { BriefFormData } from "./steps";

export interface SubmitResult {
  ok: boolean;
  error?: string;
}

export async function submitBrief(data: BriefFormData): Promise<SubmitResult> {
  const empresa = String(data.empresa ?? "").trim();
  const email = String(data.email ?? "").trim();

  if (!empresa || !email) {
    return {
      ok: false,
      error: "Falta el nombre de la empresa o el correo de contacto.",
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "El correo electrónico no parece válido." };
  }

  const supabase = createServerSupabase();

  const { data: inserted, error } = await supabase
    .from("briefs")
    .insert({
      empresa,
      contacto: String(data.contacto ?? ""),
      email,
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

  // No bloqueamos la respuesta al usuario si el correo tarda o falla —
  // el brief ya quedó guardado, que es lo que no se puede perder.
  void notifyNewBrief(inserted.id, data);

  return { ok: true };
}
