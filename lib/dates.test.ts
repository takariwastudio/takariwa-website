import { describe, it, expect, vi } from "vitest";
import { daysAgoISOString, bucketByDay } from "./dates";

describe("daysAgoISOString", () => {
  it("resta N días en ISO", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-15T12:00:00.000Z"));
    const iso = daysAgoISOString(7);
    expect(iso).toBe(new Date("2026-09-08T12:00:00.000Z").toISOString());
    vi.useRealTimers();
  });
});

describe("bucketByDay", () => {
  it("genera N cubetas con ceros si no hay datos", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-15T10:00:00.000Z"));
    const buckets = bucketByDay([], 3);
    expect(buckets.length).toBe(3);
    expect(buckets.every((b) => b.count === 0)).toBe(true);
    expect(buckets[2].date).toBe("2026-09-15");
    vi.useRealTimers();
  });
  it("cuenta timestamps por día y ignora fuera de ventana", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-15T10:00:00.000Z"));
    const buckets = bucketByDay(
      [
        "2026-09-15T08:00:00.000Z",
        "2026-09-15T09:00:00.000Z",
        "2026-09-14T12:00:00.000Z",
        "2026-09-01T00:00:00.000Z", // fuera de ventana 3 días
      ],
      3,
    );
    expect(buckets.find((b) => b.date === "2026-09-15")?.count).toBe(2);
    expect(buckets.find((b) => b.date === "2026-09-14")?.count).toBe(1);
    expect(buckets.find((b) => b.date === "2026-09-13")?.count).toBe(0);
    vi.useRealTimers();
  });
});
