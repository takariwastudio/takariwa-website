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
import { daysAgoISOString, bucketByDay } from "@/lib/dates";
import {
  BRIEF_TYPE_LABEL,
  BRIEF_TYPE_COLOR_HEX,
  type BriefType,
} from "@/app/briefs/_shared/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BriefsTrendChart, BriefsTypeChart } from "@/components/admin/charts";

export const dynamic = "force-dynamic";

const TREND_DAYS = 30;

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
  const trendWindowStart = daysAgoISOString(TREND_DAYS);

  // "allRows" alimenta las tarjetas de arriba (histórico completo, como
  // siempre). "trendRows" es una consulta aparte, acotada a los últimos
  // TREND_DAYS días, solo para las gráficas de abajo — no comparten
  // resultado a propósito, para no confundir "total histórico" con
  // "total de la ventana de la gráfica".
  const [{ data: allRows }, { count: newThisWeek }, { data: trendRows }] =
    await Promise.all([
      supabase.from("briefs").select("type"),
      supabase
        .from("briefs")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo),
      supabase
        .from("briefs")
        .select("type, created_at")
        .gte("created_at", trendWindowStart),
    ]);

  const total = allRows?.length ?? 0;
  const types = Object.keys(TYPE_ICON) as BriefType[];
  const countByType = types.map((t) => ({
    type: t,
    count: allRows?.filter((r) => r.type === t).length ?? 0,
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

  const trendData = bucketByDay(
    (trendRows ?? []).map((r) => r.created_at),
    TREND_DAYS,
  ).map((d) => ({ label: d.label, count: d.count }));

  const typeDataInWindow = types.map((t) => ({
    type: t,
    count: trendRows?.filter((r) => r.type === t).length ?? 0,
  }));

  const typeChartData = typeDataInWindow
    .filter((c) => c.count > 0)
    .map((c) => ({
      label: BRIEF_TYPE_LABEL[c.type],
      count: c.count,
      color: `#${BRIEF_TYPE_COLOR_HEX[c.type]}`,
    }));

  return (
    <div className="px-4 py-6 sm:px-6 md:px-8 md:py-10">
      <p className="font-body text-[0.7rem] tracking-[0.2em] text-accent uppercase">
        Takariwa Studio
      </p>
      <h1 className="font-display mt-1 mb-8 text-4xl tracking-wide text-foreground">
        Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
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

      <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Briefs recibidos</CardTitle>
            <CardDescription>Últimos {TREND_DAYS} días</CardDescription>
          </CardHeader>
          <CardContent>
            <BriefsTrendChart data={trendData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Por tipo</CardTitle>
            <CardDescription>Últimos {TREND_DAYS} días</CardDescription>
          </CardHeader>
          <CardContent>
            <BriefsTypeChart data={typeChartData} />
          </CardContent>
        </Card>
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
