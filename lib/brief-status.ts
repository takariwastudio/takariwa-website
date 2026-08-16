/**
 * Estados del brief — nombres con la voz de Takariwa en vez de genéricos de
 * CRM. "En ejecución" e "Impacto" además son un guiño directo a dos pasos de
 * la metodología real (La Excavación → La Ruptura → La Ejecución → El
 * Impacto), no nombres inventados sueltos.
 */
export const STATUSES = [
  "nuevo",
  "en_evaluacion",
  "propuesta_enviada",
  "propuesta_rechazada",
  "propuesta_aceptada",
  "trabajando",
  "entregado",
  "cancelado",
] as const;

export type BriefStatus = (typeof STATUSES)[number];

export type BadgeVariant =
  | "default"
  | "secondary"
  | "accent"
  | "destructive"
  | "outline"
  | "purple";

export const STATUS_LABEL: Record<BriefStatus, string> = {
  nuevo: "Aterrizó",
  en_evaluacion: "Bajo la lupa",
  propuesta_enviada: "Bala en el aire",
  propuesta_rechazada: "Se apagó",
  propuesta_aceptada: "Luz verde",
  trabajando: "En ejecución",
  entregado: "Impacto",
  cancelado: "Abortado",
};

export const STATUS_VARIANT: Record<BriefStatus, BadgeVariant> = {
  nuevo: "purple",
  en_evaluacion: "secondary",
  propuesta_enviada: "accent",
  propuesta_rechazada: "outline",
  propuesta_aceptada: "default",
  trabajando: "destructive",
  entregado: "default",
  cancelado: "outline",
};

export function statusLabel(status: string): string {
  return STATUS_LABEL[status as BriefStatus] ?? status;
}

export function statusVariant(status: string): BadgeVariant {
  return STATUS_VARIANT[status as BriefStatus] ?? "outline";
}
