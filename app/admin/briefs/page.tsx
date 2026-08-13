import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { BRIEF_TYPE_LABEL, type BriefType } from "@/app/briefs/_shared/types";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  nuevo: "Nuevo",
  en_revision: "En revisión",
  aprobado: "Aprobado",
  archivado: "Archivado",
};

const TYPE_BADGE: Record<BriefType, string> = {
  web: "bg-blue text-paper",
  diseno: "bg-magenta text-paper",
};

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
    <div className="min-h-dvh bg-paper px-6 py-12 text-ink">
      <div className="mx-auto max-w-3xl">
        <p className="font-body text-[0.7rem] tracking-[0.2em] text-orange uppercase">
          Takariwa Studio — Admin
        </p>
        <h1 className="font-display mt-1 mb-6 text-4xl tracking-wide">
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
              className={`rounded-full border px-4 py-2 font-body text-sm font-semibold transition-colors ${
                filter === tab.value
                  ? "border-transparent bg-ink text-paper"
                  : "border-ink/15 text-ink/60 hover:border-ink/40"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {error && (
          <p className="font-body text-sm text-orange">
            No se pudieron cargar los briefs: {error.message}
          </p>
        )}

        {!error && briefs?.length === 0 && (
          <p className="font-body text-sm text-ink/55">
            Todavía no ha llegado ningún brief.
          </p>
        )}

        {!error && briefs && briefs.length > 0 && (
          <table className="w-full border-collapse font-body text-sm">
            <thead>
              <tr>
                <th className="border-b border-ink/15 px-2 py-2 text-left text-xs tracking-wide text-ink/50 uppercase">
                  Empresa
                </th>
                <th className="border-b border-ink/15 px-2 py-2 text-left text-xs tracking-wide text-ink/50 uppercase">
                  Contacto
                </th>
                <th className="border-b border-ink/15 px-2 py-2 text-left text-xs tracking-wide text-ink/50 uppercase">
                  Tipo
                </th>
                <th className="border-b border-ink/15 px-2 py-2 text-left text-xs tracking-wide text-ink/50 uppercase">
                  Fecha
                </th>
                <th className="border-b border-ink/15 px-2 py-2 text-left text-xs tracking-wide text-ink/50 uppercase">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {briefs.map((b) => (
                <tr key={b.id}>
                  <td className="border-b border-ink/8 px-2 py-3">
                    <Link
                      href={`/admin/briefs/${b.id}`}
                      className="font-semibold text-ink hover:underline"
                    >
                      {b.empresa}
                    </Link>
                  </td>
                  <td className="border-b border-ink/8 px-2 py-3">
                    {b.contacto}{" "}
                    {b.email && (
                      <span className="text-ink/50">· {b.email}</span>
                    )}
                  </td>
                  <td className="border-b border-ink/8 px-2 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${TYPE_BADGE[b.type as BriefType]}`}
                    >
                      {BRIEF_TYPE_LABEL[b.type as BriefType] ?? b.type}
                    </span>
                  </td>
                  <td className="border-b border-ink/8 px-2 py-3">
                    {new Date(b.created_at).toLocaleDateString("es-VE")}
                  </td>
                  <td className="border-b border-ink/8 px-2 py-3">
                    <span className="rounded-full bg-yellow px-3 py-1 text-xs font-semibold text-ink">
                      {STATUS_LABEL[b.status] ?? b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
