import { getProjects } from "@/lib/projects";
import TrabajosGrid from "./TrabajosGrid";

export default async function Trabajos() {
  const projects = await getProjects();

  return (
    <section id="trabajo" className="bg-ink px-6 py-20 md:px-12">
      <p className="font-body text-[10px] leading-[0.95] text-orange uppercase">
        Nuestro trabajo
      </p>
      <div className="mt-3 w-[171px] border-t border-orange" />

      <TrabajosGrid projects={projects} />
    </section>
  );
}
