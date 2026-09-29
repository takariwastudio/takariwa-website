import type { MetadataRoute } from "next";
import { createBrowserSupabase } from "@/lib/supabase/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://takariwa.studio";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/trabajos`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  try {
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("projects")
      .select("slug, created_at")
      .order("position", { ascending: true });

    const projectRoutes: MetadataRoute.Sitemap = (data ?? []).map((p) => ({
      url: `${base}/trabajos/${p.slug}`,
      lastModified: p.created_at ? new Date(p.created_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...projectRoutes];
  } catch {
    return staticRoutes;
  }
}
