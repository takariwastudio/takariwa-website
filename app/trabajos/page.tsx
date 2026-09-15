import { getProjects } from "@/lib/projects";
import SiteFooter from "../_components/SiteFooter";
import SiteNav from "../_components/SiteNav";
import TrabajosList from "./_components/TrabajosList";

export const dynamic = "force-dynamic";

export default async function TrabajosPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-dvh bg-ink px-6 pt-6 pb-8 md:px-12 md:pt-10">
      <SiteNav />

      <header className="mt-10 md:mt-20">
        <p className="font-body text-[10px] leading-[0.95] text-orange uppercase">
          Nuestro trabajo
        </p>
        <div className="mt-3 w-[171px] border-t border-orange" />
        <h1 className="mt-6 font-display text-[2.5rem] leading-[0.9] text-paper sm:text-[3.5rem] md:text-[5rem]">
          Trabajos
        </h1>
        <p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-paper/60">
          Todos los proyectos del estudio. Filtra por categoría para explorar.
        </p>
      </header>

      <TrabajosList projects={projects} />

      <SiteFooter />
    </div>
  );
}
