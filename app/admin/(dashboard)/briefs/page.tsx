import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  BRIEF_TYPE_LABEL,
  BRIEF_TYPE_VARIANT,
  type BriefType,
} from "@/app/briefs/_shared/types";
import { statusLabel, statusVariant } from "@/lib/brief-status";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const ALL_TYPES: BriefType[] = ["web", "diseno", "social", "audiovisual"];

// Anchos fijos por columna — con table-layout:fixed, esto es lo que evita
// que las columnas "bailen" de tamaño al cambiar de pestaña según el largo
// del contenido que traiga cada filtro. Solo aplica en la tabla de md+; en
// mobile se usa la vista de tarjetas de más abajo.
const COLS = [
  { width: "26%", label: "Empresa" },
  { width: "28%", label: "Contacto" },
  { width: "12%", label: "Tipo" },
  { width: "14%", label: "Fecha" },
  { width: "20%", label: "Estado" },
];

const PAGE_SIZE = 20;

export default async function AdminBriefListPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; page?: string }>;
}) {
  const { type, page: pageRaw } = await searchParams;
  const filter = ALL_TYPES.includes(type as BriefType)
    ? (type as BriefType)
    : "all";
  const page = Math.max(1, parseInt(pageRaw ?? "1", 10) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = createServerSupabase();
  let query = supabase
    .from("briefs")
    .select("id, created_at, type, empresa, contacto, email, status", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filter !== "all") query = query.eq("type", filter);

  const { data: briefs, error, count } = await query;
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  const tabs: { label: string; value: "all" | BriefType }[] = [
    { label: "Todos", value: "all" },
    ...ALL_TYPES.map((t) => ({ label: BRIEF_TYPE_LABEL[t], value: t })),
  ];

  return (
    <div className="px-4 py-6 sm:px-6 md:px-8 md:py-10">
      <p className="font-body text-[0.7rem] tracking-[0.2em] text-accent uppercase">
        Takariwa Studio
      </p>
      <h1 className="font-display mt-1 mb-6 text-3xl tracking-wide text-foreground sm:text-4xl">
        Briefs recibidos
      </h1>

      <div className="mb-6 flex flex-wrap gap-2 md:mb-8">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={
              tab.value === "all"
                ? "/admin/briefs"
                : `/admin/briefs?type=${tab.value}`
            }
            className={cn(
              "rounded-full border px-3.5 py-1.5 font-body text-sm font-semibold transition-colors sm:px-4 sm:py-2",
              filter === tab.value
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {error && (
        <p className="font-body text-sm text-destructive">
          No se pudieron cargar los briefs: {error.message}
        </p>
      )}

      {!error && briefs?.length === 0 && (
        <p className="font-body text-sm text-muted-foreground">
          Todavía no ha llegado ningún brief.
        </p>
      )}

      {!error && briefs && briefs.length > 0 && (
        <>
          {/* Mobile / tablet angosto: tarjetas apiladas — 5 columnas de
              tabla nunca iban a caber legibles en una pantalla de teléfono. */}
          <div className="flex flex-col gap-3 md:hidden">
            {briefs.map((b) => (
              <Link
                key={b.id}
                href={`/admin/briefs/${b.id}`}
                className="block rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-body font-semibold text-foreground">
                    {b.empresa}
                  </span>
                  <Badge variant={BRIEF_TYPE_VARIANT[b.type as BriefType]}>
                    {BRIEF_TYPE_LABEL[b.type as BriefType] ?? b.type}
                  </Badge>
                </div>
                <p className="mt-1 font-body text-sm text-foreground/70">
                  {b.contacto}
                  {b.email && (
                    <span className="text-muted-foreground"> · {b.email}</span>
                  )}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <Badge variant={statusVariant(b.status)}>
                    {statusLabel(b.status)}
                  </Badge>
                  <span className="font-body text-xs text-muted-foreground">
                    {new Date(b.created_at).toLocaleDateString("es-VE")}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* md+: tabla completa. */}
          <div className="hidden overflow-hidden rounded-xl border border-border md:block">
            <table
              className="w-full font-body text-sm"
              style={{ tableLayout: "fixed" }}
            >
              <colgroup>
                {COLS.map((c) => (
                  <col key={c.label} style={{ width: c.width }} />
                ))}
              </colgroup>
              <thead>
                <tr className="bg-card">
                  {COLS.map((c) => (
                    <th
                      key={c.label}
                      className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                    >
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {briefs.map((b) => (
                  <tr key={b.id} className="border-t border-border">
                    <td className="truncate px-4 py-3">
                      <Link
                        href={`/admin/briefs/${b.id}`}
                        className="truncate font-semibold text-foreground hover:underline"
                      >
                        {b.empresa}
                      </Link>
                    </td>
                    <td className="truncate px-4 py-3 text-foreground/80">
                      {b.contacto}{" "}
                      {b.email && (
                        <span className="text-muted-foreground">
                          · {b.email}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={BRIEF_TYPE_VARIANT[b.type as BriefType]}>
                        {BRIEF_TYPE_LABEL[b.type as BriefType] ?? b.type}
                      </Badge>
                    </td>
                    <td className="truncate px-4 py-3 text-foreground/80">
                      {new Date(b.created_at).toLocaleDateString("es-VE")}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant(b.status)}>
                        {statusLabel(b.status)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="font-body text-xs text-muted-foreground">
                Página {page} de {totalPages} · {count} briefs
              </p>
              <div className="flex gap-2">
                {page > 1 ? (
                  <Link
                    href={`/admin/briefs${filter !== "all" ? `?type=${filter}&page=${page - 1}` : `?page=${page - 1}`}`}
                    className="rounded-full border border-border px-4 py-1.5 font-body text-sm text-foreground hover:bg-muted"
                  >
                    ← Anterior
                  </Link>
                ) : (
                  <span className="rounded-full border border-border/50 px-4 py-1.5 font-body text-sm text-muted-foreground/50">
                    ← Anterior
                  </span>
                )}
                {page < totalPages ? (
                  <Link
                    href={`/admin/briefs${filter !== "all" ? `?type=${filter}&page=${page + 1}` : `?page=${page + 1}`}`}
                    className="rounded-full border border-border px-4 py-1.5 font-body text-sm text-foreground hover:bg-muted"
                  >
                    Siguiente →
                  </Link>
                ) : (
                  <span className="rounded-full border border-border/50 px-4 py-1.5 font-body text-sm text-muted-foreground/50">
                    Siguiente →
                  </span>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
