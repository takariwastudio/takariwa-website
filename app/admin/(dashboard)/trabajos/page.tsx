import type { Metadata } from "next";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { CreateProjectForm } from "./CreateProjectForm";
import { DeleteProjectButton } from "./DeleteProjectButton";
import { ProjectsList } from "./ProjectsList";

export const metadata: Metadata = {
  title: "Trabajos | Admin",
};

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  tag: string;
  category: string;
  hero_image_url: string;
  position: number;
};

export default async function AdminTrabajosPage() {
  const supabase = createServerSupabase();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, slug, title, tag, category, hero_image_url, position")
    .order("position", { ascending: true })
    .returns<ProjectRow[]>();

  if (error) {
    console.error("Error obteniendo proyectos:", error);
  }

  return (
    <div className="px-4 py-6 sm:px-6 md:px-8 md:py-10">
      <p className="font-body text-[0.7rem] tracking-[0.2em] text-accent uppercase">
        Takariwa Studio
      </p>
      <h1 className="font-display mt-1 mb-2 text-3xl tracking-wide text-foreground sm:text-4xl">
        Trabajos
      </h1>
      <p className="mb-6 font-body text-sm text-muted-foreground md:mb-8">
        Los proyectos que crees acá aparecen en &quot;Nuestro trabajo&quot; del
        homepage y en /trabajos. Arrastra para reordenar.
      </p>

      <CreateProjectForm />

      <ProjectsList projects={projects ?? []} />
    </div>
  );
}
