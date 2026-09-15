import { describe, it, expect } from "vitest";
import { createSessionToken, verifySessionToken } from "./admin-session";

describe("admin-session", () => {
  it("crea y verifica token válido", async () => {
    const secret = "a".repeat(32);
    const token = await createSessionToken(secret, 60);
    expect(await verifySessionToken(token, secret)).toBe(true);
  });
  it("rechaza token con secret distinto", async () => {
    const token = await createSessionToken("a".repeat(32), 60);
    expect(await verifySessionToken(token, "b".repeat(32))).toBe(false);
  });
  it("rechaza token manipulado", async () => {
    const secret = "c".repeat(32);
    const token = await createSessionToken(secret, 60);
    const tampered = token.slice(0, -1) + (token.endsWith("0") ? "1" : "0");
    expect(await verifySessionToken(tampered, secret)).toBe(false);
  });
  it("rechaza undefined y formato inválido", async () => {
    expect(await verifySessionToken(undefined, "x".repeat(32))).toBe(false);
    expect(await verifySessionToken("no-dot", "x".repeat(32))).toBe(false);
  });
  it("rechaza token expirado", async () => {
    const secret = "d".repeat(32);
    const token = await createSessionToken(secret, -1); // ya expirado
    expect(await verifySessionToken(token, secret)).toBe(false);
  });
});
