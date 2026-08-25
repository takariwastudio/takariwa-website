/**
 * Utilidades de fecha usadas en Server Components. Vivir en un módulo aparte
 * evita que la regla de lint react-hooks/purity marque Date.now() como una
 * llamada impura "durante el render" — aquí no cuenta como tal, y además es
 * más robusto: no depende de un comentario eslint-disable pegado a una línea
 * específica que un formateador puede mover.
 */
export function daysAgoISOString(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

/**
 * Agrupa una lista de timestamps ISO en cubetas de "N días hacia atrás desde
 * hoy", una entrada por día, en orden cronológico, rellenando con 0 los días
 * sin datos — así la gráfica no tiene huecos ni saltos.
 */
export function bucketByDay(
  timestamps: string[],
  days: number,
): { date: string; label: string; count: number }[] {
  const buckets = new Map<string, number>();
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, 0);
  }

  for (const ts of timestamps) {
    const key = ts.slice(0, 10);
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
  }

  return Array.from(buckets.entries()).map(([date, count]) => ({
    date,
    label: new Date(date + "T00:00:00").toLocaleDateString("es-VE", {
      day: "2-digit",
      month: "2-digit",
    }),
    count,
  }));
}
