import Link from "next/link";
import { Inbox, Globe, Palette, Share2, CalendarClock } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import { daysAgoISOString } from "@/lib/dates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

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
  const webCount = rows?.filter((r) => r.type === "web").length ?? 0;
  const disenoCount = rows?.filter((r) => r.type === "diseno").length ?? 0;
  const socialCount = rows?.filter((r) => r.type === "social").length ?? 0;

  const stats = [
    { label: "Total de briefs", value: total, icon: Inbox },
    {
      label: "Nuevos esta semana",
      value: newThisWeek ?? 0,
      icon: CalendarClock,
    },
    { label: "Briefs de web", value: webCount, icon: Globe },
    { label: "Briefs de diseño", value: disenoCount, icon: Palette },
    { label: "Briefs de social", value: socialCount, icon: Share2 },
  ];

  return (
    <div className="px-8 py-10">
      <p className="font-body text-[0.7rem] tracking-[0.2em] text-accent uppercase">
        Takariwa Studio
      </p>
      <h1 className="font-display mt-1 mb-8 text-4xl tracking-wide text-foreground">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
