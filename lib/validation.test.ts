import { describe, it, expect } from "vitest";
import {
  isValidEmail,
  validateEmpresa,
  validateContacto,
  validateNombre,
  validateTelefono,
  validateMensaje,
  validateBriefPayloadSize,
  isHoneypotTriggered,
} from "./validation";

describe("isValidEmail", () => {
  it("acepta emails válidos", () => {
    expect(isValidEmail("hola@takariwa.studio")).toBe(true);
    expect(isValidEmail("a@b.co")).toBe(true);
  });
  it("rechaza formato inválido", () => {
    expect(isValidEmail("hola@")).toBe(false);
    expect(isValidEmail("hola")).toBe(false);
    expect(isValidEmail("@takariwa.studio")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
  it("rechaza si >254 chars", () => {
    expect(isValidEmail("a".repeat(250) + "@b.co")).toBe(false);
  });
});

describe("validateEmpresa", () => {
  it("ok con nombre válido", () => {
    expect(validateEmpresa("Takariwa Studio")).toBeNull();
    expect(validateEmpresa("AB")).toBeNull();
  });
  it("error si vacío", () => {
    expect(validateEmpresa("")).toBe("Falta el nombre de la marca/empresa.");
    expect(validateEmpresa("   ")).toBe("Falta el nombre de la marca/empresa.");
  });
  it("error si demasiado corto o largo", () => {
    expect(validateEmpresa("A")).toBe("El nombre debe tener 2–120 caracteres.");
    expect(validateEmpresa("a".repeat(121))).toBe("El nombre debe tener 2–120 caracteres.");
  });
});

describe("validateContacto", () => {
  it("permite vacío (opcional)", () => {
    expect(validateContacto("")).toBeNull();
  });
  it("error si >120", () => {
    expect(validateContacto("a".repeat(121))).toBe("El nombre de contacto es demasiado largo.");
  });
});

describe("validateNombre", () => {
  it("ok rango 2-80", () => {
    expect(validateNombre("Ana")).toBeNull();
    expect(validateNombre("a".repeat(80))).toBeNull();
  });
  it("error si vacío o fuera de rango", () => {
    expect(validateNombre("")).toBe("El nombre es obligatorio.");
    expect(validateNombre("A")).toBe("El nombre debe tener 2–80 caracteres.");
    expect(validateNombre("a".repeat(81))).toBe("El nombre debe tener 2–80 caracteres.");
  });
});

describe("validateTelefono", () => {
  it("ok", () => expect(validateTelefono("584226340416")).toBeNull());
  it("error si vacío", () => expect(validateTelefono("")).toBe("El teléfono es obligatorio."));
  it("error si >30", () => expect(validateTelefono("1".repeat(31))).toBe("El teléfono es demasiado largo."));
});

describe("validateMensaje", () => {
  it("ok 10-5000", () => {
    expect(validateMensaje("Hola mundo!!")).toBeNull();
    expect(validateMensaje("a".repeat(5000))).toBeNull();
  });
  it("error si vacío/corto/largo", () => {
    expect(validateMensaje("")).toBe("El mensaje es obligatorio.");
    expect(validateMensaje("corto")).toBe("El mensaje debe tener 10–5000 caracteres.");
    expect(validateMensaje("a".repeat(5001))).toBe("El mensaje debe tener 10–5000 caracteres.");
  });
});

describe("validateBriefPayloadSize", () => {
  it("ok payload pequeño", () => expect(validateBriefPayloadSize({ a: "hola" })).toBeNull());
  it("error si >50k", () => {
    expect(validateBriefPayloadSize({ data: "x".repeat(50_001) })).toBe(
      "El brief es demasiado grande. Reduce el contenido.",
    );
  });
  it("null si falla stringify es atrapado", () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    expect(validateBriefPayloadSize(circular)).toBe("Datos inválidos.");
  });
});

describe("isHoneypotTriggered", () => {
  it("false si vacío o ausente", () => {
    expect(isHoneypotTriggered({})).toBe(false);
    expect(isHoneypotTriggered({ website: "" })).toBe(false);
    expect(isHoneypotTriggered({ website: "   " })).toBe(false);
  });
  it("true si website relleno", () => {
    expect(isHoneypotTriggered({ website: "spam" })).toBe(true);
    expect(isHoneypotTriggered({ _hp: "bot" })).toBe(true);
  });
});
