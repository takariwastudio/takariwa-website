/**
 * Validaciones centralizadas — sin zod para no añadir dependencia extra.
 * Reutilizadas por briefs y contacto. Si crece, migrar a zod.
 */

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

export function validateEmpresa(value: string): string | null {
  const v = value.trim();
  if (!v) return "Falta el nombre de la marca/empresa.";
  if (v.length < 2 || v.length > 120) return "El nombre debe tener 2–120 caracteres.";
  return null;
}

export function validateContacto(value: string): string | null {
  if (!value) return null;
  if (value.length > 120) return "El nombre de contacto es demasiado largo.";
  return null;
}

export function validateNombre(value: string): string | null {
  const v = value.trim();
  if (!v) return "El nombre es obligatorio.";
  if (v.length < 2 || v.length > 80) return "El nombre debe tener 2–80 caracteres.";
  return null;
}

export function validateTelefono(value: string): string | null {
  if (!value.trim()) return "El teléfono es obligatorio.";
  if (value.length > 30) return "El teléfono es demasiado largo.";
  return null;
}

export function validateMensaje(value: string): string | null {
  const v = value.trim();
  if (!v) return "El mensaje es obligatorio.";
  if (v.length < 10 || v.length > 5000) return "El mensaje debe tener 10–5000 caracteres.";
  return null;
}

export function validateBriefPayloadSize(data: unknown): string | null {
  try {
    const size = JSON.stringify(data).length;
    if (size > 50_000) return "El brief es demasiado grande. Reduce el contenido.";
  } catch {
    return "Datos inválidos.";
  }
  return null;
}

export function isHoneypotTriggered(data: Record<string, unknown>): boolean {
  const hp = String(data.website ?? data._hp ?? "").trim();
  return hp.length > 0;
}
