"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { STATUSES, type BriefStatus } from "@/lib/brief-status";

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
  return { ok: true };
}
