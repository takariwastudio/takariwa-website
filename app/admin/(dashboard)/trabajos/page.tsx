import type { Metadata } from "next";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { CreateProjectForm } from "./CreateProjectForm";
import { DeleteProjectButton } from "./DeleteProjectButton";

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
};

export default async function AdminTrabajosPage() {
  const supabase = createServerSupabase();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, slug, title, tag, category, hero_image_url")
    .order("created_at", { ascending: true })
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
        homepage y en /trabajos. Las imágenes de galería se agregan editando el
        proyecto ya creado.
      </p>

      <CreateProjectForm />

      <div className="mt-6 flex flex-col gap-3">
        {(projects ?? []).map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4"
          >
            <Link
              href={`/admin/trabajos/${project.id}`}
              className="flex min-w-0 flex-1 items-center gap-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.hero_image_url}
                alt={project.title}
                className="h-14 w-24 shrink-0 rounded bg-background object-cover"
              />
              <div className="min-w-0">
                <p className="truncate font-body text-sm font-semibold text-foreground">
                  {project.title}
                </p>
                <p className="truncate font-body text-xs text-muted-foreground">
                  {project.category} · {project.tag}
                </p>
              </div>
            </Link>

            <DeleteProjectButton id={project.id} title={project.title} />
          </div>
        ))}

        {(projects ?? []).length === 0 && (
          <p className="font-body text-sm text-muted-foreground">
            Todavía no hay proyectos creados.
          </p>
        )}
      </div>
    </div>
  );
}
