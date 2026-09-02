"use client";

import { useState } from "react";
import Link from "next/link";
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

      <div className="mt-8 flex flex-col gap-3 md:mt-10">
        {visibleProjects.map((project) => (
          <Link
            key={project.id}
            href={`/trabajos/${project.slug}`}
            className="group relative flex h-24 items-end justify-end overflow-hidden bg-paper p-3 transition-opacity hover:opacity-90 md:h-[102px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.hero_image_url}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-ink/80 to-transparent"
            />
            <span
              className="relative font-body text-[10px] uppercase"
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
