import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
import { STEPS as SOCIAL_STEPS } from "@/app/briefs/social_brief/steps";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StatusSelect } from "./StatusSelect";

export const dynamic = "force-dynamic";

const STEPS_BY_TYPE: Record<BriefType, StepDef[]> = {
  web: WEB_STEPS,
  diseno: DESIGN_STEPS,
  social: SOCIAL_STEPS,
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
    <div className="px-8 py-10">
      <Link
        href="/admin/briefs"
        className="inline-flex items-center gap-2 font-body text-sm font-semibold text-accent hover:underline"
      >
        <ArrowLeft className="size-4" />
        Todos los briefs
      </Link>

      <div className="mt-6 flex items-center gap-3">
        <Badge
          variant={
            type === "web"
              ? "secondary"
              : type === "diseno"
                ? "destructive"
                : "purple"
          }
        >
          {BRIEF_TYPE_LABEL[type]}
        </Badge>
        <StatusSelect id={brief.id} initialStatus={brief.status} />
        <span className="font-body text-xs text-muted-foreground">
          {new Date(brief.created_at).toLocaleString("es-VE")}
        </span>
      </div>
      <h1 className="font-display mt-1 text-4xl tracking-wide text-foreground">
        {brief.empresa}
      </h1>
      <p className="font-body text-foreground/70">
        {brief.contacto} {brief.email && <>· {brief.email}</>}
      </p>

      <div className="mt-10 flex flex-col gap-4">
        {steps.map((s) => {
          const rows = s.fields
            .map((f) => {
              const val = formData[f.id];
              if (!val || (Array.isArray(val) && val.length === 0)) return null;
              return { field: f, val };
            })
            .filter(Boolean) as {
            field: (typeof s.fields)[number];
            val: string | string[];
          }[];

          if (rows.length === 0) return null;

          return (
            <Card key={s.id}>
              <h2 className="font-display text-lg tracking-wide text-accent">
                {s.title}
              </h2>
              <div className="flex flex-col gap-2.5">
                {rows.map(({ field, val }) => {
                  if (field.type === "file" && Array.isArray(val)) {
                    return (
                      <div key={field.id}>
                        <p className="font-body text-sm font-semibold text-foreground">
                          {field.label}:
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-2">
                          {val.map((url) => (
                            <a
                              key={url}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block overflow-hidden rounded-lg border border-border"
                            >
                              {isImageUrl(url) ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={url}
                                  alt="Referencia"
                                  className="h-24 w-24 object-cover"
                                />
                              ) : (
                                <span className="flex h-24 w-24 items-center justify-center bg-muted p-2 text-center font-body text-xs text-muted-foreground">
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
                      className="font-body text-sm leading-relaxed text-foreground/85"
                    >
                      <strong className="text-foreground">
                        {field.label}:
                      </strong>{" "}
                      {display}
                    </p>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
