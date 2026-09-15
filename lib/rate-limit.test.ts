import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { checkRateLimit } from "./rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("permite hasta el límite y bloquea después", () => {
    const ns = `test-${Date.now()}-1`;
    const key = "1.2.3.4";
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit(ns, key, 5, 10 * 60 * 1000).allowed).toBe(true);
    }
    const blocked = checkRateLimit(ns, key, 5, 10 * 60 * 1000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });

  it("resetea tras la ventana", () => {
    const ns = `test-${Date.now()}-2`;
    const key = "5.6.7.8";
    const windowMs = 1000;
    for (let i = 0; i < 3; i++) checkRateLimit(ns, key, 3, windowMs);
    expect(checkRateLimit(ns, key, 3, windowMs).allowed).toBe(false);
    vi.advanceTimersByTime(windowMs + 10);
    expect(checkRateLimit(ns, key, 3, windowMs).allowed).toBe(true);
  });

  it("aisla por namespace y por key", () => {
    const ns1 = `ns1-${Date.now()}`;
    const ns2 = `ns2-${Date.now()}`;
    expect(checkRateLimit(ns1, "ip-A", 1, 60000).allowed).toBe(true);
    expect(checkRateLimit(ns1, "ip-A", 1, 60000).allowed).toBe(false);
    // otra IP en mismo namespace → permitido
    expect(checkRateLimit(ns1, "ip-B", 1, 60000).allowed).toBe(true);
    // misma IP en otro namespace → permitido
    expect(checkRateLimit(ns2, "ip-A", 1, 60000).allowed).toBe(true);
  });
});
