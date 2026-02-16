import { describe, it, expect } from "vitest";
import { computeSummary } from "../hooks/usePageAnalytics";

function makeEvent(overrides: Record<string, unknown> = {}) {
  return {
    id: "evt-1",
    eventType: "page_view",
    eventData: null,
    deviceType: null,
    createdAt: "2026-01-15T12:00:00Z",
    ...overrides,
  };
}

describe("computeSummary", () => {
  it("returns zeroes for empty events", () => {
    const s = computeSummary([]);
    expect(s.pageViews).toBe(0);
    expect(s.uniqueDevices).toBe(0);
    expect(s.totalTimeMs).toBe(0);
    expect(s.sectionStats).toEqual([]);
    expect(s.engagementScore).toBe(0);
    expect(s.hasApproved).toBe(false);
    expect(s.hasDeclined).toBe(false);
    expect(s.deviceBreakdown).toEqual({ mobile: 0, tablet: 0, desktop: 0 });
  });

  it("counts page views", () => {
    const s = computeSummary([makeEvent(), makeEvent({ id: "evt-2" })]);
    expect(s.pageViews).toBe(2);
  });

  it("scores +20 for having any page views", () => {
    const s = computeSummary([makeEvent()]);
    expect(s.engagementScore).toBeGreaterThanOrEqual(20);
  });

  it("scores +10 more for multiple page views", () => {
    const single = computeSummary([makeEvent()]);
    const multi = computeSummary([makeEvent(), makeEvent({ id: "evt-2" })]);
    expect(multi.engagementScore).toBe(single.engagementScore + 10);
  });

  it("counts unique devices", () => {
    const s = computeSummary([
      makeEvent({ deviceType: "mobile" }),
      makeEvent({ id: "evt-2", deviceType: "mobile" }),
      makeEvent({ id: "evt-3", deviceType: "desktop" }),
    ]);
    expect(s.uniqueDevices).toBe(2);
  });

  it("tallies device breakdown", () => {
    const s = computeSummary([
      makeEvent({ deviceType: "mobile" }),
      makeEvent({ id: "evt-2", deviceType: "tablet" }),
      makeEvent({ id: "evt-3", deviceType: "desktop" }),
      makeEvent({ id: "evt-4", deviceType: "desktop" }),
    ]);
    expect(s.deviceBreakdown).toEqual({ mobile: 1, tablet: 1, desktop: 2 });
  });

  it("aggregates section stats from section_view and section_scroll", () => {
    const s = computeSummary([
      makeEvent({ eventType: "section_view", eventData: { sectionId: "s1" } }),
      makeEvent({ id: "evt-2", eventType: "section_view", eventData: { sectionId: "s1" } }),
      makeEvent({ id: "evt-3", eventType: "section_scroll", eventData: { sectionId: "s1", duration: 5000 } }),
      makeEvent({ id: "evt-4", eventType: "section_view", eventData: { sectionId: "s2" } }),
    ]);
    expect(s.sectionStats).toHaveLength(2);
    const s1 = s.sectionStats.find((x) => x.sectionId === "s1");
    expect(s1!.views).toBe(2);
    expect(s1!.totalTime).toBe(5000);
  });

  it("sums totalTimeMs across all sections", () => {
    const s = computeSummary([
      makeEvent({ eventType: "section_scroll", eventData: { sectionId: "s1", duration: 10000 } }),
      makeEvent({ id: "evt-2", eventType: "section_scroll", eventData: { sectionId: "s2", duration: 20000 } }),
    ]);
    expect(s.totalTimeMs).toBe(30000);
  });

  it("scores +15 for 3+ sections viewed", () => {
    const events = [
      makeEvent({ eventType: "section_view", eventData: { sectionId: "s1" } }),
      makeEvent({ id: "e2", eventType: "section_view", eventData: { sectionId: "s2" } }),
      makeEvent({ id: "e3", eventType: "section_view", eventData: { sectionId: "s3" } }),
    ];
    const s = computeSummary(events);
    // No page_view events, so base score is 0 + 15 (3 sections)
    expect(s.engagementScore).toBe(15);
  });

  it("scores +15 at 30s and +10 more at 60s total time", () => {
    const at30s = computeSummary([
      makeEvent({ eventType: "section_scroll", eventData: { sectionId: "s1", duration: 30000 } }),
    ]);
    // 0 (no page views) + 15 (30s threshold)
    expect(at30s.engagementScore).toBe(15);

    const at60s = computeSummary([
      makeEvent({ eventType: "section_scroll", eventData: { sectionId: "s1", duration: 60000 } }),
    ]);
    // 0 + 15 (30s) + 10 (60s)
    expect(at60s.engagementScore).toBe(25);
  });

  it("scores +30 for approval", () => {
    const s = computeSummary([makeEvent({ eventType: "approved" })]);
    expect(s.hasApproved).toBe(true);
    expect(s.engagementScore).toBe(30);
  });

  it("sets hasDeclined flag", () => {
    const s = computeSummary([makeEvent({ eventType: "declined" })]);
    expect(s.hasDeclined).toBe(true);
  });

  it("scores +10 for request_changes action", () => {
    const s = computeSummary([
      makeEvent({ eventType: "section_view", eventData: { action: "request_changes" } }),
    ]);
    expect(s.engagementScore).toBe(10);
  });

  it("scores +10 for video_play", () => {
    const s = computeSummary([makeEvent({ eventType: "video_play" })]);
    expect(s.engagementScore).toBe(10);
  });

  it("caps engagement score at 100", () => {
    const events = [
      // +20 page view + 10 multi visit
      makeEvent({ deviceType: "desktop" }),
      makeEvent({ id: "e2", deviceType: "desktop" }),
      // +30 approved
      makeEvent({ id: "e3", eventType: "approved" }),
      // +10 video
      makeEvent({ id: "e4", eventType: "video_play" }),
      // +10 request changes
      makeEvent({ id: "e5", eventType: "section_view", eventData: { action: "request_changes" } }),
      // +15 for 3+ sections
      makeEvent({ id: "e6", eventType: "section_view", eventData: { sectionId: "a" } }),
      makeEvent({ id: "e7", eventType: "section_view", eventData: { sectionId: "b" } }),
      makeEvent({ id: "e8", eventType: "section_view", eventData: { sectionId: "c" } }),
      // +25 for 60s+ time
      makeEvent({ id: "e9", eventType: "section_scroll", eventData: { sectionId: "a", duration: 60000 } }),
    ];
    const s = computeSummary(events);
    // 20 + 10 + 30 + 10 + 10 + 15 + 15 + 10 = 120 → capped at 100
    expect(s.engagementScore).toBe(100);
  });
});
