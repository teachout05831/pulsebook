"use client";

import { Phone, MessageSquare, Mail, Users, StickyNote, Bell, FileText, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface TimelineEntryData {
  id: string;
  source: "interaction" | "follow_up" | "system";
  type: string;
  title: string;
  description: string | null;
  outcome: string | null;
  timestamp: string;
  performedByName: string | null;
  durationSeconds?: number | null;
  hideTime?: boolean;
}

const TYPE_CONFIG: Record<string, { icon: React.ElementType; bg: string; text: string }> = {
  call: { icon: Phone, bg: "bg-green-100", text: "text-green-600" },
  text: { icon: MessageSquare, bg: "bg-blue-100", text: "text-blue-600" },
  email: { icon: Mail, bg: "bg-pink-100", text: "text-pink-600" },
  meeting: { icon: Users, bg: "bg-amber-100", text: "text-amber-600" },
  note: { icon: StickyNote, bg: "bg-emerald-100", text: "text-emerald-600" },
  follow_up: { icon: Bell, bg: "bg-yellow-100", text: "text-yellow-600" },
  estimate: { icon: FileText, bg: "bg-violet-100", text: "text-violet-600" },
  system: { icon: Star, bg: "bg-gray-100", text: "text-gray-500" },
};

const OUTCOME_STYLES: Record<string, string> = {
  positive: "bg-green-100 text-green-700",
  neutral: "bg-gray-100 text-gray-600",
  no_answer: "bg-gray-100 text-gray-600",
  follow_up_needed: "bg-amber-100 text-amber-700",
};

const OUTCOME_LABELS: Record<string, string> = {
  positive: "Positive",
  neutral: "Neutral",
  no_answer: "No Answer",
  follow_up_needed: "Needs Follow-up",
};

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  return `${mins} min`;
}

interface TimelineEntryProps {
  entry: TimelineEntryData;
}

export function TimelineEntry({ entry }: TimelineEntryProps) {
  const config = TYPE_CONFIG[entry.type] || TYPE_CONFIG.system;
  const Icon = config.icon;

  return (
    <div className="flex gap-3 py-3">
      <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${config.bg}`}>
        <Icon className={`h-3.5 w-3.5 ${config.text}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold">{entry.title}</span>
            {entry.outcome && OUTCOME_STYLES[entry.outcome] && (
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${OUTCOME_STYLES[entry.outcome]}`}>
                {OUTCOME_LABELS[entry.outcome]}
              </Badge>
            )}
          </div>
          {!entry.hideTime && <span className="text-xs text-muted-foreground shrink-0">{formatTime(entry.timestamp)}</span>}
        </div>
        {entry.description && (
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed whitespace-pre-wrap break-words">{entry.description}</p>
        )}
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          {entry.performedByName && <span>{entry.performedByName}</span>}
          {entry.durationSeconds && entry.durationSeconds > 0 && (
            <span>&middot; {formatDuration(entry.durationSeconds)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
