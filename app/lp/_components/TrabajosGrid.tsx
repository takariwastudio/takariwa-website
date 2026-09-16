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

// Ritmo del bento tomado del Figma: 2 filas de 12 columnas que se repiten
// cada 7 tarjetas, sin importar cuántas queden después de filtrar.
const BENTO_SPANS = [
  "md:col-span-7",
  "md:col-span-2",
  "md:col-span-3",
  "md:col-span-4",
  "md:col-span-2",
  "md:col-span-4",
  "md:col-span-2",
];

export default function TrabajosGrid({
  projects,
}: {
  projects: ProjectSummary[];
}) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("general");

  const visibleProjects =
    activeFilter === "general"
      ? projects.slice(0, 7)
      : projects
          .filter((project) => project.category === activeFilter)
          .slice(0, 7);

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

      <div className="mt-8 grid grid-cols-1 gap-5 md:mt-10 md:grid-cols-12 md:auto-rows-[258px] md:gap-6">
        {visibleProjects.map((project, index) => (
          <Link
            key={project.id}
            href={`/trabajos/${project.slug}`}
            className={`group relative flex h-[220px] items-end justify-end overflow-hidden bg-paper p-3 transition-opacity hover:opacity-90 md:h-full ${BENTO_SPANS[index % BENTO_SPANS.length]}`}
          >
            <Image
              src={project.hero_image_url}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink/80 to-transparent"
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
          <p className="col-span-12 font-body text-[10px] text-paper/60 uppercase">
            Todavía no hay proyectos en esta categoría.
          </p>
        )}
      </div>

      <div className="mt-8 flex justify-end md:mt-10">
        <Link
          href="/trabajos"
          className="font-body text-[10px] text-paper uppercase transition-colors hover:text-yellow"
        >
          Ver más &gt;
        </Link>
      </div>
    </>
  );
}
