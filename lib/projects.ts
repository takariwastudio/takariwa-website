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
  position: number;
};

export type ProjectDetail = ProjectSummary & {
  paragraph_1: string;
  paragraph_2: string;
  services: string[];
  video_urls: string[];
  images: string[];
};

export const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "general", label: "General" },
  { key: "diseño", label: "Diseño" },
  { key: "desarrollo", label: "Desarrollo" },
  { key: "audiovisual", label: "Audiovisuales" },
];

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  diseño: "Diseño",
  desarrollo: "Desarrollo",
  audiovisual: "Audiovisual",
};

export const CATEGORY_COLORS: Record<ProjectCategory, string> = {
  diseño: "var(--color-magenta)",
  desarrollo: "var(--color-orange)",
  audiovisual: "var(--color-purple)",
};

export async function getProjects(): Promise<ProjectSummary[]> {
  const supabase = createBrowserSupabase();
  const { data, error } = await supabase
    .from("projects")
    .select("id, slug, title, tag, category, hero_image_url, position")
    .order("position", { ascending: true });

  if (error) {
    console.error("Error obteniendo proyectos:", error);
    return [];
  }

  return (data ?? []) as ProjectSummary[];
}

export async function getProjectBySlug(
  slug: string,
): Promise<ProjectDetail | null> {
  const supabase = createBrowserSupabase();

  const { data: project, error } = await supabase
    .from("projects")
    .select(
      "id, slug, title, tag, category, hero_image_url, paragraph_1, paragraph_2, services, video_urls, position",
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
}
