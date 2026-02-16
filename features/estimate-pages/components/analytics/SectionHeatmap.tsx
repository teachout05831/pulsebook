"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import type { FC } from "react";

interface SectionStat {
  sectionId: string;
  views: number;
  totalTime: number;
}

interface SectionHeatmapProps {
  sectionStats: SectionStat[];
}

function formatSectionName(id: string): string {
  return id
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

export const SectionHeatmap: FC<SectionHeatmapProps> = ({ sectionStats }) => {
  const sorted = useMemo(
    () => [...sectionStats].sort((a, b) => b.totalTime - a.totalTime),
    [sectionStats]
  );

  const maxTime = useMemo(
    () => (sorted.length > 0 ? sorted[0].totalTime : 0),
    [sorted]
  );

  if (sorted.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4" />
            Section Engagement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <BarChart3 className="mb-2 h-8 w-8 opacity-40" />
            <p className="text-sm">No section data yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="h-4 w-4" />
          Section Engagement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sorted.map((stat) => {
          const widthPct = maxTime > 0 ? (stat.totalTime / maxTime) * 100 : 0;

          return (
            <div key={stat.sectionId} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium truncate max-w-[40%]">
                  {formatSectionName(stat.sectionId)}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">
                    {formatTime(stat.totalTime)}
                  </span>
                  <Badge variant="secondary" className="text-xs px-2 py-0">
                    {stat.views} {stat.views === 1 ? "view" : "views"}
                  </Badge>
                </div>
              </div>
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
                  style={{
                    width: `${Math.max(widthPct, 2)}%`,
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
