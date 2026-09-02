"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

function slugifyFileName(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function addClient(formData: FormData): Promise<ActionResult> {
  const name = formData.get("name")?.toString().trim() ?? "";
  const websiteUrl = formData.get("website_url")?.toString().trim() ?? "";
  const logo = formData.get("logo");

  if (!name) {
    return { ok: false, error: "El nombre es obligatorio." };
  }

  if (!(logo instanceof File) || logo.size === 0) {
    return { ok: false, error: "Selecciona un logo." };
  }

  const supabase = createServerSupabase();
  const fileName = `${crypto.randomUUID()}-${slugifyFileName(logo.name)}`;

  const { error: uploadError } = await supabase.storage
    .from("client-logos")
    .upload(fileName, logo, {
      contentType: logo.type || "image/webp",
      upsert: false,
    });

  if (uploadError) {
    console.error("Error subiendo logo:", uploadError);
    return { ok: false, error: "No se pudo subir el logo." };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("client-logos").getPublicUrl(fileName);

  const { error: insertError } = await supabase.from("clients").insert({
    name,
    logo_url: publicUrl,
    website_url: websiteUrl || null,
  });

  if (insertError) {
    console.error("Error guardando cliente:", insertError);
    // El archivo ya se subió pero el insert falló — no dejar el logo huérfano.
    await supabase.storage.from("client-logos").remove([fileName]);
    return { ok: false, error: "No se pudo guardar el cliente." };
  }

  revalidatePath("/admin/clientes");
  revalidatePath("/lp");

  return { ok: true };
}

export async function deleteClient(
  id: string,
  logoUrl: string,
): Promise<ActionResult> {
  const supabase = createServerSupabase();

  const { error: deleteError } = await supabase
    .from("clients")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error("Error eliminando cliente:", deleteError);
    return { ok: false, error: "No se pudo eliminar el cliente." };
  }

  // El path dentro del bucket es lo que viene después de "client-logos/"
  // en la URL pública — si por lo que sea no calza, no truena el borrado
  // del cliente en sí, solo deja el archivo huérfano en storage.
  const filePath = logoUrl.split("/client-logos/")[1];
  if (filePath) {
    await supabase.storage.from("client-logos").remove([filePath]);
  }

  revalidatePath("/admin/clientes");
  revalidatePath("/lp");

  return { ok: true };
}
