"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Inbox, ArrowLeft, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAdmin } from "@/app/admin/login/actions";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/briefs", label: "Briefs", icon: Inbox, exact: false },
  // Más secciones del admin van aquí — clientes, contenido, lo que haga falta.
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-background px-4 py-6">
      <div className="mb-8 flex items-center gap-2 px-2">
        <img src="/logo.svg" alt="Takariwa Studio" className="h-9 w-auto" />
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 font-body text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/"
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-body text-sm font-medium text-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Volver al sitio
      </Link>

      <form action={logoutAdmin}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 font-body text-sm font-medium text-foreground/50 transition-colors hover:bg-muted hover:text-destructive"
        >
          <LogOut className="size-4" />
          Cerrar sesión
        </button>
      </form>
    </aside>
  );
}
