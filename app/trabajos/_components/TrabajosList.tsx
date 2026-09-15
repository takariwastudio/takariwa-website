"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CATEGORY_COLORS,
  FILTERS,
  type FilterKey,
  type ProjectSummary,
} from "@/lib/projects";

export default function TrabajosList({
  projects,
}: {
  projects: ProjectSummary[];
}) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("general");

  const visibleProjects =
    activeFilter === "general"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  return (
    <>
      <nav
        className="mt-10 flex flex-wrap gap-x-6 gap-y-2 md:mt-16"
        aria-label="Filtrar trabajos por categoría"
      >
        {FILTERS.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => setActiveFilter(filter.key)}
            className={`font-body text-[10px] uppercase transition-colors ${
              activeFilter === filter.key
                ? "text-yellow"
                : "text-paper/70 hover:text-paper"
            }`}
            aria-pressed={activeFilter === filter.key}
          >
            &gt;{filter.label}
          </button>
        ))}
      </nav>

      <div className="mt-8 columns-1 gap-4 sm:columns-2 md:mt-10 md:columns-3 md:gap-6">
        {visibleProjects.map((project) => (
          <Link
            key={project.id}
            href={`/trabajos/${project.slug}`}
            className="group relative mb-4 block aspect-[4/3] w-full break-inside-avoid overflow-hidden bg-paper transition-opacity hover:opacity-90 md:mb-6"
          >
            <Image
              src={project.hero_image_url}
              alt={project.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink/90 to-transparent"
            />
            <span
              className="absolute inset-x-0 bottom-0 p-3 font-body text-[10px] leading-snug uppercase"
              style={{ color: CATEGORY_COLORS[project.category] }}
            >
              {project.tag} | {project.title} &gt;
            </span>
          </Link>
        ))}

        {visibleProjects.length === 0 && (
          <p className="font-body text-sm text-paper/60 uppercase">
            Todavía no hay proyectos en esta categoría.
          </p>
        )}
      </div>
    </>
  );
}
