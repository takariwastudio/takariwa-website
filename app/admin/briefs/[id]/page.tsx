import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  BRIEF_TYPE_LABEL,
  type BriefFormData,
  type BriefType,
  type StepDef,
} from "@/app/briefs/_shared/types";
import { STEPS as WEB_STEPS } from "@/app/briefs/web_brief/steps";
import { STEPS as DESIGN_STEPS } from "@/app/briefs/design_brief/steps";

export const dynamic = "force-dynamic";

const STEPS_BY_TYPE: Record<BriefType, StepDef[]> = {
  web: WEB_STEPS,
  diseno: DESIGN_STEPS,
};

function isImageUrl(url: string) {
  return /\.(png|jpe?g|webp|gif|avif)$/i.test(url);
}

export default async function AdminBriefDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServerSupabase();
  const { data: brief, error } = await supabase
    .from("briefs")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !brief) notFound();

  const formData = brief.data as BriefFormData;
  const type = (brief.type as BriefType) ?? "web";
  const steps = STEPS_BY_TYPE[type] ?? WEB_STEPS;

  return (
    <div className="min-h-dvh bg-paper px-6 py-12 text-ink">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/admin/briefs"
          className="font-body text-sm font-semibold text-orange hover:underline"
        >
          ← Todos los briefs
        </Link>

        <p className="mt-6 font-body text-xs text-ink/50">
          {new Date(brief.created_at).toLocaleString("es-VE")} · {brief.status}{" "}
          · {BRIEF_TYPE_LABEL[type]}
        </p>
        <h1 className="font-display mt-1 text-4xl tracking-wide">
          {brief.empresa}
        </h1>
        <p className="font-body text-ink/60">
          {brief.contacto} {brief.email && <>· {brief.email}</>}
        </p>

        <div className="mt-10 flex flex-col gap-6">
          {steps.map((s) => {
            const rows = s.fields
              .map((f) => {
                const val = formData[f.id];
                if (!val || (Array.isArray(val) && val.length === 0))
                  return null;
                return { field: f, val };
              })
              .filter(Boolean) as {
              field: (typeof s.fields)[number];
              val: string | string[];
            }[];

            if (rows.length === 0) return null;

            return (
              <div key={s.id} className="border-b border-ink/10 pb-5">
                <h2 className="font-display mb-2 text-lg tracking-wide text-orange">
                  {s.title}
                </h2>
                {rows.map(({ field, val }) => {
                  if (field.type === "file" && Array.isArray(val)) {
                    return (
                      <div key={field.id} className="mb-3">
                        <p className="font-body text-sm font-semibold">
                          {field.label}:
                        </p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {val.map((url) => (
                            <a
                              key={url}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block overflow-hidden rounded-lg border border-ink/10"
                            >
                              {isImageUrl(url) ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={url}
                                  alt="Referencia"
                                  className="h-24 w-24 object-cover"
                                />
                              ) : (
                                <span className="flex h-24 w-24 items-center justify-center bg-ink/5 p-2 text-center font-body text-xs text-ink/60">
                                  {url.split("/").pop()?.slice(0, 20)}
                                </span>
                              )}
                            </a>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  const display = Array.isArray(val) ? val.join(", ") : val;
                  return (
                    <p
                      key={field.id}
                      className="font-body text-sm leading-relaxed"
                    >
                      <strong>{field.label}:</strong> {display}
                    </p>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
