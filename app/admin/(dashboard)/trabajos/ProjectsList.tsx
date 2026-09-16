"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { GripVertical } from "lucide-react";
import { DeleteProjectButton } from "./DeleteProjectButton";
import { reorderProjects } from "./actions";

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  tag: string;
  category: string;
  hero_image_url: string;
  position: number;
};

export function ProjectsList({
  projects: initial,
}: {
  projects: ProjectRow[];
}) {
  const [projects, setProjects] = useState(initial);
  const [saving, setSaving] = useState(false);
  const dragIndex = useRef<number | null>(null);

  function handleDragStart(index: number) {
    dragIndex.current = index;
  }

  function handleDragOver(event: React.DragEvent, index: number) {
    event.preventDefault();
    if (dragIndex.current === null || dragIndex.current === index) return;

    const reordered = [...projects];
    const [moved] = reordered.splice(dragIndex.current, 1);
    reordered.splice(index, 0, moved);
    dragIndex.current = index;
    setProjects(reordered);
  }

  async function handleDrop() {
    dragIndex.current = null;
    setSaving(true);
    await reorderProjects(projects.map((p) => p.id));
    setSaving(false);
  }

  return (
    <div className="mt-6 flex flex-col gap-2">
      {saving && (
        <p className="font-body text-xs text-muted-foreground">
          Guardando orden…
        </p>
      )}

      {projects.map((project, index) => (
        <div
          key={project.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(event) => handleDragOver(event, index)}
          onDrop={handleDrop}
          className="flex cursor-grab items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 active:cursor-grabbing"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <GripVertical className="size-4 shrink-0 text-muted-foreground" />

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
          </div>

          <DeleteProjectButton id={project.id} title={project.title} />
        </div>
      ))}

      {projects.length === 0 && (
        <p className="font-body text-sm text-muted-foreground">
          Todavía no hay proyectos creados.
        </p>
      )}
    </div>
  );
}
