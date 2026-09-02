import Link from "next/link";
import SiteNav from "../_components/SiteNav";
import SocialLinksBar from "../_components/SocialLinksBar";
import TrabajosList from "./_components/TrabajosList";
import { getProjects } from "@/lib/projects";

export default async function TrabajosPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-dvh bg-ink px-6 pt-6 pb-8 md:px-12 md:pt-10">
      <SiteNav />

      <Link
        href="/lp#trabajo"
        className="font-body text-[10px] text-paper uppercase transition-colors hover:text-yellow"
      >
        &lt; Volver atrás
      </Link>

      <TrabajosList projects={projects} />

      <div className="mt-16 border-t border-paper/20 pt-4 md:mt-24">
        <SocialLinksBar />
      </div>
    </div>
  );
}
