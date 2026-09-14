"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "servicios", label: "Servicios" },
  { id: "clientes", label: "Clientes" },
  { id: "trabajo", label: "Trabajo" },
  { id: "quienes-somos", label: "Quienes somos" },
  { id: "contacto", label: "Contacto" },
];

function NavList({
  prefix,
  activeId,
  onNavigate,
}: {
  prefix: string;
  activeId: string;
  onNavigate: (id: string) => void;
}) {
  return (
    <ul className="flex flex-col items-end">
      {NAV_ITEMS.map((item) => {
        const isActive = activeId === item.id;

        return (
          <li key={item.id}>
            <a
              href={`${prefix}#${item.id}`}
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? "true" : undefined}
              className={`whitespace-nowrap font-body text-[10px] uppercase transition-colors hover:text-yellow ${
                isActive ? "font-bold text-yellow" : "text-paper"
              }`}
            >
              &gt; {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default function SiteNav() {
  const pathname = usePathname();
  // En /lp los anchors son de la misma página ("#home"). En cualquier otra
  // ruta (como /trabajos) apuntan de vuelta al homepage ("/lp#home").
  const prefix = pathname === "/lp" ? "" : "/lp";

  const [activeId, setActiveId] = useState("home");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) =>
      document.getElementById(item.id),
    ).filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    // Franja angosta a media pantalla: la sección "activa" es la que la cruza.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Desktop: lista siempre visible, junto al logo de cada sección */}
      <div className="fixed top-9 right-12 z-30 hidden lg:block">
        <nav aria-label="Navegación principal">
          <NavList
            prefix={prefix}
            activeId={activeId}
            onNavigate={setActiveId}
          />
        </nav>
      </div>

      {/* Mobile/tablet: el favicon siempre acompaña; al tocarlo despliega el menú */}
      <div className="fixed top-6 right-6 z-30 lg:hidden">
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          className="block p-1"
        >
          <img src="/favicon.svg" alt="" className="h-8 w-8" />
        </button>

        {isOpen && (
          <nav
            aria-label="Navegación principal"
            className="absolute top-11 right-0 min-w-[190px] rounded bg-ink px-4 py-3 shadow-lg"
          >
            <NavList
              prefix={prefix}
              activeId={activeId}
              onNavigate={(id) => {
                setActiveId(id);
                setIsOpen(false);
              }}
            />
          </nav>
        )}
      </div>
    </>
  );
}
