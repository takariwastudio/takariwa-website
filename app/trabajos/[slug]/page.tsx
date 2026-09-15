import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getProjectBySlug,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from "@/lib/projects";
import { toVideoEmbed } from "@/lib/video-embed";
import SiteFooter from "../../_components/SiteFooter";
import SiteNav from "../../_components/SiteNav";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <div className="min-h-dvh bg-ink px-6 pt-6 pb-8 md:px-12 md:pt-10">
      <SiteNav />

      <Link
        href="/trabajos"
        className="font-body text-[10px] text-paper uppercase transition-colors hover:text-yellow"
      >
        &lt; Volver atrás
      </Link>

      <div className="mt-10 flex flex-col gap-6 md:mt-36 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <h1 className="min-w-0 font-display text-[3rem] leading-[0.85] break-words text-paper sm:text-[4rem] lg:text-[6rem] xl:text-[7rem]">
          {project.title}
        </h1>

        <div className="relative aspect-[681/354] w-full shrink-0 overflow-hidden bg-paper lg:w-[56%]">
          <Image
            src={project.hero_image_url}
            alt={project.title}
            fill
            sizes="(max-width: 1024px) 100vw, 56vw"
            className="object-cover"
            priority
          />
        </div>
      </div>

      {project.paragraph_1 && (
        <p className="mt-10 font-body text-base leading-snug text-paper uppercase md:mt-16 md:text-2xl md:leading-[0.95]">
          {project.paragraph_1}
        </p>
      )}

      {project.video_urls.length > 0 && (
        <div className="mt-10 flex flex-col gap-6 md:mt-16">
          {project.video_urls.map((url) => {
            const embed = toVideoEmbed(url);
            if (!embed) return null;

            return (
              <div
                key={url}
                className="relative aspect-video w-full overflow-hidden bg-paper"
              >
                {embed.type === "iframe" ? (
                  <iframe
                    src={embed.src}
                    title={project.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                ) : (
                  <video
                    src={embed.src}
                    controls
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Masonry de 3 columnas — tantas imágenes como el admin haya subido
      para este proyecto, sin cantidad fija. */}
      {project.images.length > 0 && (
        <div className="mt-10 columns-1 gap-4 sm:columns-2 md:mt-16 md:columns-3 md:gap-6">
          {project.images.map((url, index) => (
            <div
              key={url}
              className="relative mb-4 w-full break-inside-avoid overflow-hidden bg-paper md:mb-6"
            >
              <Image
                src={url}
                alt={`${project.title} — imagen ${index + 1}`}
                width={800}
                height={600}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                className="h-auto w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {project.paragraph_2 && (
        <p className="mt-10 font-body text-base leading-snug text-paper uppercase md:mt-16 md:text-2xl md:leading-[0.95]">
          {project.paragraph_2}
        </p>
      )}

      {project.services.length > 0 && (
        <div className="mt-10 md:mt-16">
          <p
            className="font-body text-[10px] leading-[0.95] uppercase"
            style={{ color: CATEGORY_COLORS[project.category] }}
          >
            {CATEGORY_LABELS[project.category]}
          </p>
          <ul className="mt-2 space-y-1">
            {project.services.map((item) => (
              <li
                key={item}
                className="font-body text-[10px] leading-[0.95] text-paper uppercase"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
