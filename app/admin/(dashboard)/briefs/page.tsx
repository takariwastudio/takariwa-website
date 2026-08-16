import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { BRIEF_TYPE_LABEL, type BriefType } from "@/app/briefs/_shared/types";
import { statusLabel, statusVariant } from "@/lib/brief-status";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const TYPE_VARIANT: Record<BriefType, "secondary" | "destructive"> = {
  web: "secondary",
  diseno: "destructive",
};

// Anchos fijos por columna — con table-layout:fixed, esto es lo que evita
// que las columnas "bailen" de tamaño al cambiar de pestaña según el largo
// del contenido que traiga cada filtro.
const COLS = [
  { width: "26%", label: "Empresa" },
  { width: "28%", label: "Contacto" },
  { width: "12%", label: "Tipo" },
  { width: "14%", label: "Fecha" },
  { width: "20%", label: "Estado" },
];

export default async function AdminBriefListPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const filter = type === "web" || type === "diseno" ? type : "all";

  const supabase = createServerSupabase();
  let query = supabase
    .from("briefs")
    .select("id, created_at, type, empresa, contacto, email, status")
    .order("created_at", { ascending: false });

  if (filter !== "all") query = query.eq("type", filter);

  const { data: briefs, error } = await query;

  const tabs: { label: string; value: "all" | BriefType }[] = [
    { label: "Todos", value: "all" },
    { label: "Web", value: "web" },
    { label: "Diseño", value: "diseno" },
  ];

  return (
    <div className="px-8 py-10">
      <p className="font-body text-[0.7rem] tracking-[0.2em] text-accent uppercase">
        Takariwa Studio
      </p>
      <h1 className="font-display mt-1 mb-6 text-4xl tracking-wide text-foreground">
        Briefs recibidos
      </h1>

      <div className="mb-8 flex gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={
              tab.value === "all"
                ? "/admin/briefs"
                : `/admin/briefs?type=${tab.value}`
            }
            className={cn(
              "rounded-full border px-4 py-2 font-body text-sm font-semibold transition-colors",
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
        <div className="overflow-hidden rounded-xl border border-border">
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
                      <span className="text-muted-foreground">· {b.email}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={TYPE_VARIANT[b.type as BriefType]}>
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
      )}
    </div>
  );
}
