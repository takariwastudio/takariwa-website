"use client";

import { useEffect, useRef, useState } from "react";
import type { Client } from "@/lib/clients";

// Mientras no haya clientes reales cargados desde el admin, se usan estas
// cajas placeholder para que la sección no se vea vacía/rota.
const PLACEHOLDER_COUNT = 10;

// Con pocos clientes reales (1, 2, 3...), duplicar la lista tal cual se ve
// como "el mismo logo repetido" en vez de un loop fluido. Por eso primero
// se repite hasta juntar un mínimo de piezas, y recién ahí se duplica para
// el truco del scroll infinito.
const MIN_ITEMS_PER_LOOP = 8;

export default function ClientesMarquee({ clients }: { clients: Client[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const hasClients = clients.length > 0;

  const baseLoop = hasClients
    ? Array.from({
        length: Math.max(1, Math.ceil(MIN_ITEMS_PER_LOOP / clients.length)),
      }).flatMap(() => clients)
    : [];

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <div
        className="clients-marquee-track flex w-max items-center gap-6 md:gap-8"
        style={{ animationPlayState: isInView ? "running" : "paused" }}
      >
        {hasClients
          ? [...baseLoop, ...baseLoop].map((client, i) => (
              <a
                key={`${client.id}-${i}`}
                href={client.website_url ?? undefined}
                target={client.website_url ? "_blank" : undefined}
                rel={client.website_url ? "noopener noreferrer" : undefined}
                className="flex h-[46px] w-[120px] shrink-0 items-center justify-center md:h-[66px] md:w-[171px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={client.logo_url}
                  alt={client.name}
                  className="max-h-full max-w-full object-contain"
                />
              </a>
            ))
          : Array.from({ length: PLACEHOLDER_COUNT * 2 }).map((_, i) => (
              <div
                key={i}
                className="h-[46px] w-[120px] shrink-0 bg-paper/85 md:h-[66px] md:w-[171px]"
                aria-hidden="true"
              />
            ))}
      </div>
    </div>
  );
}
