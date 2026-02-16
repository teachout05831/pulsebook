"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye, Layers, Clock, CheckCircle, XCircle,
  MessageSquare, Play, DollarSign, Activity,
} from "lucide-react";
import type { FC, ElementType } from "react";

interface ActivityEvent {
  id: string;
  eventType: string;
  eventData: Record<string, unknown> | null;
  deviceType: string | null;
  createdAt: string;
}

interface ActivityTimelineProps {
  events: ActivityEvent[];
}

type EventConfig = { icon: ElementType; color: string; label: string };

function getEventConfig(e: ActivityEvent): EventConfig {
  const d = e.eventData;
  switch (e.eventType) {
    case "page_view":
      return { icon: Eye, color: "bg-blue-500", label: "Viewed the estimate page" };
    case "section_view":
      return { icon: Layers, color: "bg-gray-400", label: `Viewed ${d?.sectionId ?? "a"} section` };
    case "section_scroll":
      return { icon: Clock, color: "bg-gray-400", label: `Spent ${d?.duration ?? "?"}s on ${d?.sectionId ?? "a section"}` };
    case "approved":
      return { icon: CheckCircle, color: "bg-green-500", label: "Approved the estimate" };
    case "declined":
      return { icon: XCircle, color: "bg-red-500", label: "Declined the estimate" };
    case "cta_click":
      if (d?.action === "request_changes") {
        const msg = d?.message ? `: ${d.message}` : "";
        return { icon: MessageSquare, color: "bg-amber-500", label: `Requested changes${msg}` };
      }
      return { icon: Activity, color: "bg-gray-400", label: `CTA click: ${d?.action ?? "unknown"}` };
    case "video_play":
      return { icon: Play, color: "bg-purple-500", label: "Watched video" };
    case "pricing_hover":
      return { icon: DollarSign, color: "bg-blue-500", label: "Reviewed pricing details" };
    default:
      return { icon: Activity, color: "bg-gray-400", label: `Activity: ${e.eventType}` };
  }
}

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMs / 3_600_000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;

  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}

type DisplayEvent = { id: string; config: EventConfig; deviceType: string | null; createdAt: string };

function groupEvents(events: ActivityEvent[]): DisplayEvent[] {
  const recent = events.slice(0, 50);
  const grouped: DisplayEvent[] = [];
  for (let i = 0; i < recent.length; i++) {
    const ev = recent[i];
    if (ev.eventType === "section_view") {
      let count = 1;
      while (i + 1 < recent.length && recent[i + 1].eventType === "section_view") { count++; i++; }
      const config = count > 1
        ? { icon: Layers, color: "bg-gray-400", label: `Viewed ${count} sections` }
        : getEventConfig(ev);
      grouped.push({ id: ev.id, config, deviceType: ev.deviceType, createdAt: ev.createdAt });
    } else {
      grouped.push({ id: ev.id, config: getEventConfig(ev), deviceType: ev.deviceType, createdAt: ev.createdAt });
    }
  }
  return grouped;
}

const DEVICE_COLORS: Record<string, string> = {
  mobile: "bg-orange-100 text-orange-700 border-orange-200",
  tablet: "bg-violet-100 text-violet-700 border-violet-200",
  desktop: "bg-sky-100 text-sky-700 border-sky-200",
};

export const ActivityTimeline: FC<ActivityTimelineProps> = ({ events }) => {
  const displayEvents = useMemo(() => groupEvents(events), [events]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {displayEvents.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No activity yet</p>
        ) : (
          <ol className="relative border-l border-muted ml-3 space-y-6">
            {displayEvents.map((item) => {
              const Icon = item.config.icon;
              return (
                <li key={item.id} className="ml-6">
                  <span className={`absolute -left-[9px] flex h-[18px] w-[18px] items-center justify-center rounded-full ${item.config.color} ring-4 ring-background`}>
                    <Icon className="h-3 w-3 text-white" />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium leading-snug">{item.config.label}</p>
                    <div className="flex items-center gap-2">
                      <time className="text-xs text-muted-foreground">{formatRelativeTime(item.createdAt)}</time>
                      {item.deviceType && (
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 leading-4 ${DEVICE_COLORS[item.deviceType.toLowerCase()] ?? ""}`}>
                          {item.deviceType}
                        </Badge>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
};
