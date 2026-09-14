"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import type { ProjectCategory } from "@/lib/projects";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

const VALID_CATEGORIES: ProjectCategory[] = [
  "diseño",
  "desarrollo",
  "audiovisual",
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

function parseLines(raw: string) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

async function uniqueSlug(
  supabase: ReturnType<typeof createServerSupabase>,
  base: string,
) {
  const root = base || "proyecto";
  let candidate = root;

  for (let attempt = 2; attempt <= 20; attempt++) {
    const { data } = await supabase
      .from("projects")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (!data) return candidate;
    candidate = `${root}-${attempt}`;
  }

  return `${root}-${crypto.randomUUID().slice(0, 6)}`;
}

function parseCategory(value: unknown): ProjectCategory | null {
  return VALID_CATEGORIES.includes(value as ProjectCategory)
    ? (value as ProjectCategory)
    : null;
}

export async function createProject(formData: FormData): Promise<ActionResult> {
  const title = formData.get("title")?.toString().trim() ?? "";
  const tag = formData.get("tag")?.toString().trim() ?? "";
  const category = parseCategory(formData.get("category")?.toString());
  const paragraph1 = formData.get("paragraph_1")?.toString().trim() ?? "";
  const paragraph2 = formData.get("paragraph_2")?.toString().trim() ?? "";
  const services = parseLines(formData.get("services")?.toString() ?? "");
  const videoUrls = parseLines(formData.get("video_urls")?.toString() ?? "");
  const hero = formData.get("hero");

  if (!title || !tag || !category) {
    return { ok: false, error: "Completa nombre, tag y categoría." };
  }

  if (!(hero instanceof File) || hero.size === 0) {
    return { ok: false, error: "Selecciona una imagen de hero." };
  }

  const supabase = createServerSupabase();
  const slug = await uniqueSlug(supabase, slugify(title));

  const heroFileName = `${slug}/hero-${crypto.randomUUID()}-${slugifyFileName(hero.name)}`;

  const { error: uploadError } = await supabase.storage
    .from("project-images")
    .upload(heroFileName, hero, {
      contentType: hero.type || "image/webp",
      upsert: false,
    });

  if (uploadError) {
    console.error("Error subiendo hero:", uploadError);
    return { ok: false, error: "No se pudo subir la imagen de hero." };
  }

  const {
    data: { publicUrl: heroUrl },
  } = supabase.storage.from("project-images").getPublicUrl(heroFileName);

  const { error: insertError } = await supabase.from("projects").insert({
    slug,
    title,
    tag,
    category,
    hero_image_url: heroUrl,
    paragraph_1: paragraph1,
    paragraph_2: paragraph2,
    services,
    video_urls: videoUrls,
  });

  if (insertError) {
    console.error("Error guardando proyecto:", insertError);
    await supabase.storage.from("project-images").remove([heroFileName]);
    return { ok: false, error: "No se pudo guardar el proyecto." };
  }

  revalidatePath("/admin/trabajos");
  revalidatePath("/lp");
  revalidatePath("/trabajos");

  return { ok: true };
}

export async function updateProject(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const title = formData.get("title")?.toString().trim() ?? "";
  const tag = formData.get("tag")?.toString().trim() ?? "";
  const category = parseCategory(formData.get("category")?.toString());
  const paragraph1 = formData.get("paragraph_1")?.toString().trim() ?? "";
  const paragraph2 = formData.get("paragraph_2")?.toString().trim() ?? "";
  const services = parseLines(formData.get("services")?.toString() ?? "");
  const videoUrls = parseLines(formData.get("video_urls")?.toString() ?? "");
  const hero = formData.get("hero");

  if (!title || !tag || !category) {
    return { ok: false, error: "Completa nombre, tag y categoría." };
  }

  const supabase = createServerSupabase();

  const updates: Record<string, unknown> = {
    title,
    tag,
    category,
    paragraph_1: paragraph1,
    paragraph_2: paragraph2,
    services,
    video_urls: videoUrls,
  };

  if (hero instanceof File && hero.size > 0) {
    const { data: existing } = await supabase
      .from("projects")
      .select("slug")
      .eq("id", id)
      .single();

    const slug = existing?.slug ?? id;
    const heroFileName = `${slug}/hero-${crypto.randomUUID()}-${slugifyFileName(hero.name)}`;

    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(heroFileName, hero, {
        contentType: hero.type || "image/webp",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error subiendo hero:", uploadError);
      return { ok: false, error: "No se pudo subir la nueva imagen de hero." };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("project-images").getPublicUrl(heroFileName);

    updates.hero_image_url = publicUrl;
  }

  const { error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("Error actualizando proyecto:", error);
    return { ok: false, error: "No se pudo actualizar el proyecto." };
  }

  revalidatePath("/admin/trabajos");
  revalidatePath(`/admin/trabajos/${id}`);
  revalidatePath("/lp");
  revalidatePath("/trabajos");

  return { ok: true };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const supabase = createServerSupabase();

  const { data: project } = await supabase
    .from("projects")
    .select("hero_image_url")
    .eq("id", id)
    .single();

  const { data: images } = await supabase
    .from("project_images")
    .select("image_url")
    .eq("project_id", id);

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    console.error("Error eliminando proyecto:", error);
    return { ok: false, error: "No se pudo eliminar el proyecto." };
  }

  const paths = [
    project?.hero_image_url,
    ...(images ?? []).map((row) => row.image_url),
  ]
    .filter((url): url is string => Boolean(url))
    .map((url) => url.split("/project-images/")[1])
    .filter((path): path is string => Boolean(path));

  if (paths.length > 0) {
    await supabase.storage.from("project-images").remove(paths);
  }

  revalidatePath("/admin/trabajos");
  revalidatePath("/lp");
  revalidatePath("/trabajos");

  return { ok: true };
}

export async function addProjectImages(
  projectId: string,
  formData: FormData,
): Promise<ActionResult> {
  const files = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (files.length === 0) {
    return { ok: false, error: "Selecciona al menos una imagen." };
  }

  const supabase = createServerSupabase();

  const { data: project } = await supabase
    .from("projects")
    .select("slug")
    .eq("id", projectId)
    .single();

  const slug = project?.slug ?? projectId;

  const uploadedPaths: string[] = [];
  const rows: { project_id: string; image_url: string }[] = [];

  for (const file of files) {
    const fileName = `${slug}/${crypto.randomUUID()}-${slugifyFileName(file.name)}`;

    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(fileName, file, {
        contentType: file.type || "image/webp",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error subiendo imagen de galería:", uploadError);
      if (uploadedPaths.length > 0) {
        await supabase.storage.from("project-images").remove(uploadedPaths);
      }
      return { ok: false, error: `No se pudo subir "${file.name}".` };
    }

    uploadedPaths.push(fileName);

    const {
      data: { publicUrl },
    } = supabase.storage.from("project-images").getPublicUrl(fileName);

    rows.push({ project_id: projectId, image_url: publicUrl });
  }

  const { error: insertError } = await supabase
    .from("project_images")
    .insert(rows);

  if (insertError) {
    console.error("Error guardando imágenes de galería:", insertError);
    await supabase.storage.from("project-images").remove(uploadedPaths);
    return { ok: false, error: "No se pudieron guardar las imágenes." };
  }

  revalidatePath(`/admin/trabajos/${projectId}`);
  revalidatePath("/trabajos");

  return { ok: true };
}

export async function deleteProjectImage(
  imageId: string,
  projectId: string,
  imageUrl: string,
): Promise<ActionResult> {
  const supabase = createServerSupabase();

  const { error } = await supabase
    .from("project_images")
    .delete()
    .eq("id", imageId);

  if (error) {
    console.error("Error eliminando imagen:", error);
    return { ok: false, error: "No se pudo eliminar la imagen." };
  }

  const path = imageUrl.split("/project-images/")[1];
  if (path) {
    await supabase.storage.from("project-images").remove([path]);
  }

  revalidatePath(`/admin/trabajos/${projectId}`);
  revalidatePath("/trabajos");

  return { ok: true };
}
