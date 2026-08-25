import type { Metadata } from "next";
import {
  BRIEF_TYPE_LABEL,
  BRIEF_TYPE_SLUG,
  BRIEF_TYPE_VARIANT,
  type BriefType,
} from "@/app/briefs/_shared/types";
import { SITE_URL } from "@/lib/site";
import { Badge } from "@/components/ui/badge";
import { LinkRow } from "./LinkRow";

export const metadata: Metadata = {
  title: "Links de briefs | Admin",
};

const ALL_TYPES: BriefType[] = ["web", "diseno", "social", "audiovisual"];

export default function AdminLinksPage() {
  return (
    <div className="px-4 py-6 sm:px-6 md:px-8 md:py-10">
      <p className="font-body text-[0.7rem] tracking-[0.2em] text-accent uppercase">
        Takariwa Studio
      </p>
      <h1 className="font-display mt-1 mb-2 text-3xl tracking-wide text-foreground sm:text-4xl">
        Links de briefs
      </h1>
      <p className="mb-6 font-body text-sm text-muted-foreground md:mb-8">
        El link directo de cada formulario, listo para copiar y mandarle a un
        cliente.
      </p>

      <div className="flex flex-col gap-3">
        {ALL_TYPES.map((type) => {
          const url = `${SITE_URL}/briefs/${BRIEF_TYPE_SLUG[type]}`;
          return (
            <div
              key={type}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="mb-3 flex items-center gap-2">
                <Badge variant={BRIEF_TYPE_VARIANT[type]}>
                  {BRIEF_TYPE_LABEL[type]}
                </Badge>
              </div>
              <LinkRow url={url} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
