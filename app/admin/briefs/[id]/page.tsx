import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { STEPS, type BriefFormData } from "@/app/briefs/web_brief/steps";

export const dynamic = "force-dynamic";

export default async function AdminBriefDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServerSupabase();
  const { data: brief, error } = await supabase.from("briefs").select("*").eq("id", id).single();

  if (error || !brief) notFound();

  const formData = brief.data as BriefFormData;

  return (
    <div className="min-h-dvh bg-paper px-6 py-12 text-ink">
      <div className="mx-auto max-w-2xl">
        <Link href="/admin/briefs" className="font-body text-sm font-semibold text-orange hover:underline">
          ← Todos los briefs
        </Link>

        <p className="mt-6 font-body text-xs text-ink/50">
          {new Date(brief.created_at).toLocaleString("es-VE")} · {brief.status}
        </p>
        <h1 className="font-display mt-1 text-4xl tracking-wide">{brief.empresa}</h1>
        <p className="font-body text-ink/60">
          {brief.contacto} · {brief.email}
        </p>

        <div className="mt-10 flex flex-col gap-6">
          {STEPS.map((s) => {
            const rows = s.fields
              .map((f) => {
                const val = formData[f.id];
                const display = Array.isArray(val) ? val.join(", ") : val;
                return display ? { label: f.label, display } : null;
              })
              .filter(Boolean) as { label: string; display: string }[];

            if (rows.length === 0) return null;

            return (
              <div key={s.id} className="border-b border-ink/10 pb-5">
                <h2 className="font-display mb-2 text-lg tracking-wide text-orange">{s.title}</h2>
                {rows.map((r) => (
                  <p key={r.label} className="font-body text-sm leading-relaxed">
                    <strong>{r.label}:</strong> {r.display}
                  </p>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
