import { describe, it, expect } from "vitest";
import { statusLabel, statusVariant, STATUSES } from "./brief-status";

describe("brief-status", () => {
  it("statusLabel mapea conocidos y hace fallback", () => {
    expect(statusLabel("nuevo")).toBe("Nuevo");
    expect(statusLabel("en_evaluacion")).toBe("En Evaluación");
    expect(statusLabel("desconocido")).toBe("desconocido");
  });
  it("statusVariant mapea y hace fallback a outline", () => {
    expect(statusVariant("nuevo")).toBe("purple");
    expect(statusVariant("cancelado")).toBe("outline");
    expect(statusVariant("inexistente")).toBe("outline");
  });
  it("STATUSES contiene 8 estados", () => {
    expect(STATUSES.length).toBe(8);
  });
});
