import Image from "next/image";

export default function QuienesSomos() {
  return (
    <section
      id="quienes-somos"
      className="flex min-h-dvh flex-col justify-center bg-ink px-6 py-20 md:px-12"
    >
      <p className="font-body text-[10px] leading-[0.95] text-magenta uppercase">
        Quienes somos
      </p>
      <div className="mt-3 w-[171px] border-t border-magenta" />

      <div className="mt-10 flex flex-col gap-8 md:mt-16 md:flex-row md:items-start md:gap-12">
        <div
          className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-paper md:w-[54%]"
          aria-hidden="true"
        >
          <Image
            src="/takariwa-studio-team-1.webp"
            alt="Equipo de Takariwa"
            fill
            className="object-cover"
            sizes="(min-width: 768px) 54vw, 100vw"
          />
        </div>

        <div className="flex-1 space-y-5 font-body text-base leading-snug text-paper uppercase md:text-2xl md:leading-[0.95]">
          <p>
            Las buenas ideas están bien, pero bajarlas a tierra es lo que
            cuenta. Aquí no vendemos humo: somos el equipo que toma una visión y
            la convierte en experiencias reales, funcionales y que se quedan en
            la memoria.
          </p>
          <p>
            En Takariwa armamos una célula donde la técnica, la lógica y la
            creatividad jalan para el mismo lado. Cada quien es un crack en su
            cancha, pero el verdadero impacto se arma cuando nos cruzamos: el
            diseño marca el campo estético, la tecnología asegura que todo corra
            sin trabas, y los audiovisuales disparan la narrativa.
          </p>
          <p>
            No trabajamos en islas. Atacamos cada reto por todos los frentes
            para entregarte resultados que no solo se ven increíbles, sino que
            están listos para romperla y escalar sin frenos en el mercado.
          </p>
        </div>
      </div>
    </section>
  );
}
