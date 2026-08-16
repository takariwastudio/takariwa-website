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
