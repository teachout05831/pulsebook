"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  ArrowLeft,
  Smartphone,
  Tablet,
  Monitor,
  Users,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { usePageAnalytics } from "../../hooks/usePageAnalytics";
import { EngagementScore } from "./EngagementScore";
import { SectionHeatmap } from "./SectionHeatmap";
import { ActivityTimeline } from "./ActivityTimeline";

interface PageAnalyticsProps {
  pageId: string;
}

export function PageAnalytics({ pageId }: PageAnalyticsProps) {
  const {
    events,
    pageViews,
    uniqueDevices,
    totalTimeMs,
    sectionStats,
    deviceBreakdown,
    engagementScore,
    hasApproved,
    hasDeclined,
    loading,
    error,
    refresh,
  } = usePageAnalytics(pageId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-24 text-muted-foreground">
        <AlertCircle className="h-8 w-8" />
        <p className="text-sm">{error}</p>
        <Button variant="outline" size="sm" onClick={refresh}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/estimate-pages/${pageId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        </div>
        <Button variant="outline" size="sm" onClick={refresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* 2x2 grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top left: Engagement Score */}
        <EngagementScore
          score={engagementScore}
          pageViews={pageViews}
          totalTimeMs={totalTimeMs}
          hasApproved={hasApproved}
          hasDeclined={hasDeclined}
        />

        {/* Top right: Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Devices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {uniqueDevices} unique {uniqueDevices === 1 ? "visitor" : "visitors"}
            </p>
            <div className="grid grid-cols-3 gap-4">
              <DeviceItem
                icon={<Smartphone className="h-5 w-5" />}
                label="Mobile"
                count={deviceBreakdown.mobile}
              />
              <DeviceItem
                icon={<Tablet className="h-5 w-5" />}
                label="Tablet"
                count={deviceBreakdown.tablet}
              />
              <DeviceItem
                icon={<Monitor className="h-5 w-5" />}
                label="Desktop"
                count={deviceBreakdown.desktop}
              />
            </div>
          </CardContent>
        </Card>

        {/* Bottom left: Section Heatmap */}
        <SectionHeatmap sectionStats={sectionStats} />

        {/* Bottom right: Activity Timeline */}
        <ActivityTimeline events={events} />
      </div>
    </div>
  );
}

function DeviceItem({
  icon,
  label,
  count,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-lg border p-3">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-xl font-semibold">{count}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
