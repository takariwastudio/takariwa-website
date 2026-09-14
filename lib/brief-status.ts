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
  nuevo: "Nuevo",
  en_evaluacion: "En Evaluación",
  propuesta_enviada: "Propuesta Enviada",
  propuesta_rechazada: "Propuesta Rechazada",
  propuesta_aceptada: "Propuesta Aceptada",
  trabajando: "Trabajando",
  entregado: "Entregado",
  cancelado: "Cancelado",
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
