"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Link2,
  Building2,
  Briefcase,
  ArrowLeft,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAdmin } from "@/app/admin/login/actions";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/briefs", label: "Briefs", icon: Inbox, exact: false },
  { href: "/admin/links", label: "Links", icon: Link2, exact: false },
  { href: "/admin/clientes", label: "Clientes", icon: Building2, exact: false },
  { href: "/admin/trabajos", label: "Trabajos", icon: Briefcase, exact: false },
];

const STORAGE_KEY = "admin_sidebar_collapsed";

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Se lee después del mount (no en el estado inicial) para no desajustar
  // el HTML que ya mandó el servidor — un layout.tsx server component no
  // tiene forma de saber la preferencia guardada en el navegador de antemano.
  // (La alternativa "recomendada" por el linter —leer localStorage en el
  // inicializador de useState— causaría un hydration mismatch real, porque
  // el servidor jamás tiene acceso a localStorage y el cliente sí.)
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored === "1") setCollapsed(true);
  }, []);

  // Cerrar el cajón al cambiar de página en mobile — si no, se queda abierto
  // tapando la página nueva que se acaba de cargar.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  }

  return (
    <>
      {/* Barra superior — solo en mobile/tablet angosto. En md+ el sidebar
          normal se encarga de todo y esta barra desaparece. */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background px-4 py-3 md:hidden">
        <img src="/logo.svg" alt="Takariwa Studio" className="h-7 w-auto" />
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú"
          className="flex size-9 items-center justify-center rounded-lg text-foreground/70 hover:bg-muted hover:text-foreground"
        >
          <Menu className="size-5" />
        </button>
      </header>

      {/* Fondo oscuro detrás del cajón abierto en mobile — clic para cerrar. */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-ink/60 md:hidden"
        />
      )}

      <aside
        className={cn(
          // Mobile: cajón fijo que entra/sale deslizando desde la izquierda.
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-background transition-transform duration-200 ease-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          // md+: vuelve a ser una columna fija normal, siempre visible,
          // con su propio ancho colapsable (icon-only) independiente del
          // cajón de mobile.
          "md:sticky md:top-0 md:z-auto md:h-dvh md:w-60 md:translate-x-0 md:transition-[width]",
          collapsed && "md:w-[68px]",
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between px-4 py-6",
            collapsed && "md:justify-center md:px-2",
          )}
        >
          <img
            src="/logo.svg"
            alt="Takariwa Studio"
            className={cn("h-9 w-auto", collapsed && "md:hidden")}
          />
          {/* Cerrar cajón — solo mobile */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-foreground/50 hover:bg-muted hover:text-foreground md:hidden"
          >
            <X className="size-4" />
          </button>
          {/* Colapsar/expandir — solo md+ */}
          <button
            type="button"
            onClick={toggleCollapsed}
            title={collapsed ? "Expandir menú" : "Colapsar menú"}
            className="hidden size-8 shrink-0 items-center justify-center rounded-lg text-foreground/50 transition-colors hover:bg-muted hover:text-foreground md:flex"
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-hidden px-3">
          {NAV_ITEMS.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 font-body text-sm font-medium whitespace-nowrap transition-colors",
                  collapsed && "md:justify-center md:px-0",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className={cn(collapsed && "md:hidden")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Tarjeta flotante — separada de los bordes del sidebar (m-3) en
            vez de barras que se estiran de punta a punta, pegada al fondo
            gracias al flex-1 del nav de arriba. */}
        <div
          className={cn(
            "m-3 flex flex-col gap-0.5 rounded-xl border border-border bg-card p-1.5",
            collapsed && "md:mx-2",
          )}
        >
          <Link
            href="/"
            title={collapsed ? "Volver al sitio" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-2.5 py-2 font-body text-sm font-medium whitespace-nowrap text-foreground/50 transition-colors hover:bg-muted hover:text-foreground",
              collapsed && "md:justify-center md:px-0",
            )}
          >
            <ArrowLeft className="size-4 shrink-0" />
            <span className={cn(collapsed && "md:hidden")}>
              Volver al sitio
            </span>
          </Link>

          <form action={logoutAdmin}>
            <button
              type="submit"
              title={collapsed ? "Cerrar sesión" : undefined}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 font-body text-sm font-medium whitespace-nowrap text-foreground/50 transition-colors hover:bg-muted hover:text-destructive",
                collapsed && "md:justify-center md:px-0",
              )}
            >
              <LogOut className="size-4 shrink-0" />
              <span className={cn(collapsed && "md:hidden")}>
                Cerrar sesión
              </span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
