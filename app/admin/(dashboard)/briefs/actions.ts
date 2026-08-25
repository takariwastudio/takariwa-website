"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { STATUSES, type BriefStatus } from "@/lib/brief-status";
import { notifyDiscordStatusChange } from "@/lib/discord";
import type { BriefType } from "@/app/briefs/_shared/types";

export interface UpdateStatusResult {
  ok: boolean;
  error?: string;
}

export async function updateBriefStatus(
  id: string,
  status: BriefStatus,
): Promise<UpdateStatusResult> {
  if (!STATUSES.includes(status)) {
    return { ok: false, error: "Estado inválido." };
  }

  const supabase = createServerSupabase();

  // Se trae el brief ANTES de actualizar — es la única forma de saber cuál
  // era el estado anterior para el mensaje de Discord ("Anterior → Nuevo").
  const { data: existing, error: fetchError } = await supabase
    .from("briefs")
    .select("type, empresa, contacto, status")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    console.error("Error leyendo brief antes de actualizar:", fetchError);
    return { ok: false, error: "No se encontró el brief." };
  }

  const previousStatus = existing.status;

  // Nada que hacer ni que notificar si el estado no cambió en realidad.
  if (previousStatus === status) {
    return { ok: true };
  }

  const { error } = await supabase
    .from("briefs")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Error actualizando estado del brief:", error);
    return { ok: false, error: "No se pudo actualizar el estado." };
  }

  revalidatePath(`/admin/briefs/${id}`);
  revalidatePath("/admin/briefs");

  // after(): igual que con el correo/Discord al recibir un brief nuevo, no
  // queremos bloquear la respuesta al admin esperando a Discord, pero
  // tampoco podemos usar "void" sin más — Vercel puede congelar la función
  // apenas responde, matando la notificación a mitad de camino.
  after(async () => {
    await notifyDiscordStatusChange(
      existing.type as BriefType,
      id,
      existing.empresa,
      existing.contacto ?? "",
      previousStatus,
      status,
    );
  });

  return { ok: true };
}
