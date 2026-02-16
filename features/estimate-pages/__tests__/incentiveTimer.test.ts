import { describe, it, expect, vi, afterEach } from "vitest";
import {
  computeTimeRemaining,
  getEffectiveDeadline,
} from "../hooks/useIncentiveTimer";
import type { IncentiveTier } from "../types";

function makeTier(overrides: Partial<IncentiveTier> = {}): IncentiveTier {
  return {
    id: "tier-1",
    label: "Early Bird",
    deadlineMode: "relative",
    relativeHours: null,
    absoluteDeadline: null,
    deadline: null,
    discountType: "percentage",
    discountValue: 10,
    message: "Save now!",
    ...overrides,
  };
}

describe("computeTimeRemaining", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns days/hours/minutes/seconds for a future deadline", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-15T12:00:00Z"));

    // 1 day, 1 hour, 1 minute, 1 second = 90061 seconds in the future
    const deadline = new Date(Date.now() + 90_061_000).toISOString();
    const result = computeTimeRemaining(deadline);

    expect(result).toEqual({ days: 1, hours: 1, minutes: 1, seconds: 1 });
  });

  it("returns null for a past deadline", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-15T12:00:00Z"));

    const result = computeTimeRemaining("2026-01-14T00:00:00Z");
    expect(result).toBeNull();
  });

  it("returns null when deadline is exactly now", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-15T12:00:00Z"));

    const result = computeTimeRemaining("2026-01-15T12:00:00Z");
    expect(result).toBeNull();
  });

  it("handles a deadline 2 hours 30 minutes away", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-15T12:00:00Z"));

    const deadline = new Date(Date.now() + 2 * 3_600_000 + 30 * 60_000).toISOString();
    const result = computeTimeRemaining(deadline);

    expect(result).toEqual({ days: 0, hours: 2, minutes: 30, seconds: 0 });
  });
});

describe("getEffectiveDeadline", () => {
  it("returns tier.deadline when set (highest priority)", () => {
    const tier = makeTier({
      deadline: "2026-02-01T00:00:00Z",
      deadlineMode: "relative",
      absoluteDeadline: "2026-03-01T00:00:00Z",
      relativeHours: 48,
    });
    expect(getEffectiveDeadline(tier)).toBe("2026-02-01T00:00:00Z");
  });

  it("returns absoluteDeadline when mode is absolute", () => {
    const tier = makeTier({
      deadlineMode: "absolute",
      absoluteDeadline: "2026-03-01T00:00:00Z",
    });
    expect(getEffectiveDeadline(tier)).toBe("2026-03-01T00:00:00Z");
  });

  it("computes relative deadline from publishedAt + relativeHours", () => {
    const tier = makeTier({ deadlineMode: "relative", relativeHours: 48 });
    const publishedAt = "2026-01-15T12:00:00Z";
    const result = getEffectiveDeadline(tier, publishedAt);

    // 48 hours after 2026-01-15T12:00:00Z = 2026-01-17T12:00:00Z
    expect(result).toBe("2026-01-17T12:00:00.000Z");
  });

  it("returns null for relative mode without publishedAt", () => {
    const tier = makeTier({ deadlineMode: "relative", relativeHours: 24 });
    expect(getEffectiveDeadline(tier, null)).toBeNull();
    expect(getEffectiveDeadline(tier)).toBeNull();
  });

  it("returns null for relative mode without relativeHours", () => {
    const tier = makeTier({ deadlineMode: "relative", relativeHours: null });
    expect(getEffectiveDeadline(tier, "2026-01-15T12:00:00Z")).toBeNull();
  });

  it("returns null when no deadline info is available", () => {
    const tier = makeTier({ deadline: null, deadlineMode: "relative", relativeHours: null, absoluteDeadline: null });
    expect(getEffectiveDeadline(tier)).toBeNull();
  });
});
