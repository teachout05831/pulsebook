"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

interface AnalyticsEvent {
  id: string;
  eventType: string;
  eventData: Record<string, unknown> | null;
  deviceType: string | null;
  createdAt: string;
}

interface SectionStat { sectionId: string; views: number; totalTime: number }

export interface AnalyticsSummary {
  events: AnalyticsEvent[];
  pageViews: number;
  uniqueDevices: number;
  totalTimeMs: number;
  sectionStats: SectionStat[];
  deviceBreakdown: { mobile: number; tablet: number; desktop: number };
  engagementScore: number;
  hasApproved: boolean;
  hasDeclined: boolean;
}

export function computeSummary(events: AnalyticsEvent[]): AnalyticsSummary {
  const pageViews = events.filter((e) => e.eventType === "page_view").length;
  const devices = new Set(events.filter((e) => e.deviceType).map((e) => e.deviceType));
  const deviceBreakdown = { mobile: 0, tablet: 0, desktop: 0 };
  events.forEach((e) => {
    if (e.deviceType === "mobile") deviceBreakdown.mobile++;
    else if (e.deviceType === "tablet") deviceBreakdown.tablet++;
    else if (e.deviceType === "desktop") deviceBreakdown.desktop++;
  });

  const sectionMap = new Map<string, SectionStat>();
  events.forEach((e) => {
    const sid = (e.eventData?.sectionId as string) || null;
    if (!sid) return;
    const stat = sectionMap.get(sid) || { sectionId: sid, views: 0, totalTime: 0 };
    if (e.eventType === "section_view") stat.views++;
    if (e.eventType === "section_scroll") stat.totalTime += (e.eventData?.duration as number) || 0;
    sectionMap.set(sid, stat);
  });
  const sectionStats = Array.from(sectionMap.values()).sort((a, b) => b.totalTime - a.totalTime);
  const totalTimeMs = sectionStats.reduce((sum, s) => sum + s.totalTime, 0);

  const hasApproved = events.some((e) => e.eventType === "approved");
  const hasDeclined = events.some((e) => e.eventType === "declined");
  const viewedSections = sectionStats.filter((s) => s.views > 0).length;
  const hasVideo = events.some((e) => e.eventType === "video_play");

  let score = 0;
  if (pageViews > 0) score += 20;
  if (viewedSections >= 3) score += 15;
  if (totalTimeMs >= 30000) score += 15;
  if (totalTimeMs >= 60000) score += 10;
  if (hasApproved) score += 30;
  if (events.some((e) => e.eventData?.action === "request_changes")) score += 10;
  if (hasVideo) score += 10;
  if (pageViews > 1) score += 10;

  return {
    events, pageViews, uniqueDevices: devices.size, totalTimeMs,
    sectionStats, deviceBreakdown, engagementScore: Math.min(score, 100),
    hasApproved, hasDeclined,
  };
}

export function usePageAnalytics(pageId: string) {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/estimate-pages/${pageId}/analytics?_limit=500`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setEvents(json.data || []);
    } catch { setError("Failed to load analytics"); } finally { setLoading(false); }
  }, [pageId]);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  const summary = useMemo(() => computeSummary(events), [events]);

  return { ...summary, loading, error, refresh: fetchAnalytics };
}
