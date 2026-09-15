import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getProjectBySlug,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from "@/lib/projects";
import SiteNav from "../_components/SiteNav";
import SocialLinksBar from "../_components/SocialLinksBar";

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

      <div className="mt-10 flex flex-col gap-6 md:mt-36 md:flex-row md:items-start md:justify-between md:gap-10">
        <h1 className="min-w-0 break-words font-display text-[3rem] leading-[0.85] text-paper sm:text-[4rem] md:text-[6rem] xl:text-[7rem]">
          {project.title}
        </h1>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.hero_image_url}
          alt={project.title}
          className="aspect-[681/354] w-full shrink-0 bg-paper object-cover md:w-[56%]"
        />
      </div>

      {project.paragraph_1 && (
        <p className="mt-10 font-body text-base leading-snug text-paper uppercase md:mt-16 md:text-2xl md:leading-[0.95]">
          {project.paragraph_1}
        </p>
      )}

      {project.images.length > 0 && (
        <div className="mt-10 columns-1 gap-4 sm:columns-2 md:mt-16 md:columns-3 md:gap-6">
          {project.images.map((url, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={url}
              src={url}
              alt={`${project.title} — imagen ${index + 1}`}
              className="mb-4 w-full break-inside-avoid bg-paper md:mb-6"
            />
          ))}
        </div>
      )}

      {project.video_urls.length > 0 && (
        <div className="mt-10 md:mt-16">
          <p
            className="font-body text-[10px] leading-[0.95] uppercase"
            style={{ color: CATEGORY_COLORS.audiovisual }}
          >
            Videos
          </p>
          <ul className="mt-2 space-y-1">
            {project.video_urls.map((url) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-[10px] leading-[0.95] text-paper uppercase underline decoration-paper/30 underline-offset-2 transition-colors hover:text-yellow"
                >
                  {url} &gt;
                </a>
              </li>
            ))}
          </ul>
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

      <div className="mt-16 border-t border-paper/20 pt-4 md:mt-24">
        <SocialLinksBar />
      </div>
    </div>
  );
}
