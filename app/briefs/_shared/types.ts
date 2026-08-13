export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "date"
  | "textarea"
  | "checkbox-group"
  | "radio-group"
  | "file";

export interface FieldDef {
  id: string;
  label: string;
  type: FieldType;
  hint?: string;
  options?: string[];
  required?: boolean;
  /** Solo para type: "file" — cuántos archivos como máximo. */
  maxFiles?: number;
}

export interface StepDef {
  id: string;
  number: string;
  title: string;
  description?: string;
  fields: FieldDef[];
}

export type BriefFormData = Record<string, string | string[]>;

export function emptyFormData(steps: StepDef[]): BriefFormData {
  return steps
    .flatMap((s) => s.fields)
    .reduce((acc, f) => {
      acc[f.id] = f.type === "checkbox-group" || f.type === "file" ? [] : "";
      return acc;
    }, {} as BriefFormData);
}

export interface IntroConfig {
  eyebrow: string;
  headline: string;
  paragraphs: string[];
  ctaLabel: string;
}

export interface DoneConfig {
  eyebrow: string;
  headline: string;
  /** Puede incluir el placeholder {{email}}, que se reemplaza en el cliente. */
  body: string;
}

export type BriefType = "web" | "diseno";

export const BRIEF_TYPE_LABEL: Record<BriefType, string> = {
  web: "Web",
  diseno: "Diseño",
};
