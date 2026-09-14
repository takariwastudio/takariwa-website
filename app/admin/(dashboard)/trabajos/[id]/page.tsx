import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import type { ProjectCategory } from "@/lib/projects";
import { EditProjectForm } from "./EditProjectForm";
import { GalleryManager } from "./GalleryManager";

export const metadata: Metadata = {
  title: "Editar proyecto | Admin",
};

type ProjectRow = {
  id: string;
  title: string;
  tag: string;
  category: ProjectCategory;
  paragraph_1: string;
  paragraph_2: string;
  services: string[];
  video_urls: string[];
};

type ProjectImageRow = {
  id: string;
  image_url: string;
};

export default async function AdminEditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServerSupabase();

  const { data: project, error } = await supabase
    .from("projects")
    .select(
      "id, title, tag, category, paragraph_1, paragraph_2, services, video_urls",
    )
    .eq("id", id)
    .single<ProjectRow>();

  if (error || !project) {
    if (error) console.error("Error obteniendo proyecto:", error);
    notFound();
  }

  const { data: images } = await supabase
    .from("project_images")
    .select("id, image_url")
    .eq("project_id", id)
    .order("created_at", { ascending: true })
    .returns<ProjectImageRow[]>();

  return (
    <div className="px-4 py-6 sm:px-6 md:px-8 md:py-10">
      <Link
        href="/admin/trabajos"
        className="mb-4 flex items-center gap-1.5 font-body text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Volver a trabajos
      </Link>

      <h1 className="font-display mb-6 text-3xl tracking-wide text-foreground sm:text-4xl">
        {project.title}
      </h1>

      <div className="flex flex-col gap-6">
        <EditProjectForm
          id={project.id}
          title={project.title}
          tag={project.tag}
          category={project.category}
          paragraph1={project.paragraph_1}
          paragraph2={project.paragraph_2}
          services={project.services}
          videoUrls={project.video_urls}
        />

        <GalleryManager projectId={project.id} images={images ?? []} />
      </div>
    </div>
  );
}
