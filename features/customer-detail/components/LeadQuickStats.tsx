"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LeadQuickStatsData } from "../types";

function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return "Never";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

interface LeadQuickStatsProps {
  stats: LeadQuickStatsData;
  serviceType?: string;
}

export function LeadQuickStats({ stats, serviceType }: LeadQuickStatsProps) {
  const isStale = stats.lastContact
    ? Date.now() - new Date(stats.lastContact).getTime() > 2 * 86400000
    : true;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
      <Card>
        <CardContent className="pt-4 pb-3 px-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Estimated Value</div>
          <div className="text-xl font-bold mt-1">{stats.estimatedValue ? `$${stats.estimatedValue.toLocaleString()}` : "—"}</div>
          {serviceType && <div className="text-xs text-muted-foreground mt-0.5">{serviceType}</div>}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4 pb-3 px-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Estimates</div>
          <div className="text-xl font-bold mt-1">{stats.estimatesCount}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{stats.estimatesCount === 1 ? "estimate" : "estimates"}</div>
        </CardContent>
      </Card>
      <Card className={cn(isStale && "border-amber-300 bg-amber-50/50")}>
        <CardContent className="pt-4 pb-3 px-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Last Contact</div>
          <div className={cn("text-xl font-bold mt-1", isStale && "text-amber-700")}>{formatRelativeTime(stats.lastContact)}</div>
          {stats.lastContact && (
            <div className="text-xs text-muted-foreground mt-0.5">
              {new Date(stats.lastContact).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4 pb-3 px-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Interactions</div>
          <div className="text-xl font-bold mt-1">{stats.interactionsCount}</div>
          <div className="text-xs text-muted-foreground mt-0.5">total logged</div>
        </CardContent>
      </Card>
    </div>
  );
}
