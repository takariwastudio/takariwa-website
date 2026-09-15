import { cache } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";

export type ProjectCategory = "diseño" | "desarrollo" | "audiovisual";
export type FilterKey = "general" | ProjectCategory;

export type ProjectSummary = {
  id: string;
  slug: string;
  title: string;
  tag: string;
  category: ProjectCategory;
  hero_image_url: string;
};

export type ProjectDetail = ProjectSummary & {
  paragraph_1: string;
  paragraph_2: string;
  services: string[];
  video_urls: string[];
  images: string[];
};

// Solo para el título que va arriba de la lista de servicios en el
// detalle ("Diseño", "Desarrollo"...) — el contenido de la lista en sí ya
// no depende de la categoría, lo carga el admin por proyecto.
export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  diseño: "Diseño",
  desarrollo: "Desarrollo",
  audiovisual: "Audiovisual",
};

export const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "general", label: "General" },
  { key: "diseño", label: "Diseño" },
  { key: "desarrollo", label: "Desarrollo" },
  { key: "audiovisual", label: "Audiovisuales" },
];

// Lectura pública (anon key) — con React cache para deduplicar fetches
// en un mismo render (ej: layout + page piden lo mismo). El admin invalida
// con revalidatePath("/trabajos") tras mutaciones.
export const getProjects = cache(async (): Promise<ProjectSummary[]> => {
  const supabase = createBrowserSupabase();
  const { data, error } = await supabase
    .from("projects")
    .select("id, slug, title, tag, category, hero_image_url")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error obteniendo proyectos:", error);
    return [];
  }

  return (data ?? []) as ProjectSummary[];
});

export const getProjectBySlug = cache(async (
  slug: string,
): Promise<ProjectDetail | null> => {
  const supabase = createBrowserSupabase();

  const { data: project, error } = await supabase
    .from("projects")
    .select(
      "id, slug, title, tag, category, hero_image_url, paragraph_1, paragraph_2, services, video_urls",
    )
    .eq("slug", slug)
    .single();

  if (error || !project) {
    if (error) console.error("Error obteniendo proyecto:", error);
    return null;
  }

  const { data: images, error: imagesError } = await supabase
    .from("project_images")
    .select("image_url")
    .eq("project_id", project.id)
    .order("created_at", { ascending: true });

  if (imagesError) {
    console.error("Error obteniendo imágenes del proyecto:", imagesError);
  }

  return {
    ...(project as unknown as ProjectDetail),
    images: (images ?? []).map((row) => row.image_url as string),
  };
});

export const CATEGORY_COLORS: Record<ProjectCategory, string> = {
  diseño: "var(--color-magenta)",
  desarrollo: "var(--color-orange)",
  audiovisual: "var(--color-purple)",
};
