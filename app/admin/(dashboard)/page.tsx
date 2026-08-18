import Link from "next/link";
import {
  Inbox,
  Globe,
  Palette,
  Share2,
  Clapperboard,
  CalendarClock,
} from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import { daysAgoISOString } from "@/lib/dates";
import { BRIEF_TYPE_LABEL, type BriefType } from "@/app/briefs/_shared/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

// Un ícono por tipo — agregar un brief nuevo es una línea acá, no reescribir
// el resto del dashboard.
const TYPE_ICON: Record<BriefType, typeof Inbox> = {
  web: Globe,
  diseno: Palette,
  social: Share2,
  audiovisual: Clapperboard,
};

export default async function AdminDashboardPage() {
  const supabase = createServerSupabase();
  const sevenDaysAgo = daysAgoISOString(7);

  const [{ data: rows }, { count: newThisWeek }] = await Promise.all([
    supabase.from("briefs").select("type"),
    supabase
      .from("briefs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo),
  ]);

  const total = rows?.length ?? 0;
  const types = Object.keys(TYPE_ICON) as BriefType[];
  const countByType = types.map((t) => ({
    type: t,
    count: rows?.filter((r) => r.type === t).length ?? 0,
  }));

  const stats = [
    { label: "Total de briefs", value: total, icon: Inbox },
    {
      label: "Nuevos esta semana",
      value: newThisWeek ?? 0,
      icon: CalendarClock,
    },
    ...countByType.map((c) => ({
      label: `Briefs de ${BRIEF_TYPE_LABEL[c.type].toLowerCase()}`,
      value: c.count,
      icon: TYPE_ICON[c.type],
    })),
  ];

  return (
    <div className="px-8 py-10">
      <p className="font-body text-[0.7rem] tracking-[0.2em] text-accent uppercase">
        Takariwa Studio
      </p>
      <h1 className="font-display mt-1 mb-8 text-4xl tracking-wide text-foreground">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>{s.label}</CardTitle>
              <s.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <span className="font-display text-4xl text-foreground">
                {s.value}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <Link
          href="/admin/briefs"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-body text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          Ver todos los briefs →
        </Link>
      </div>
    </div>
  );
}
