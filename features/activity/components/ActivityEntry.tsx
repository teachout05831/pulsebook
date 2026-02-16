"use client";

import { ACTION_DOT_COLORS } from "../types";
import type { ActivityEntry as EntryType, ActivityAction } from "../types";

function formatTimestamp(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface Props {
  entry: EntryType;
}

export function ActivityEntryRow({ entry }: Props) {
  const dotColor = ACTION_DOT_COLORS[entry.action as ActivityAction] || "bg-slate-400";

  return (
    <div className="flex gap-3 py-2">
      <span className={`w-2 h-2 rounded-full ${dotColor} mt-1.5 shrink-0`} />
      <div className="flex-1 min-w-0">
        <div
          className="text-[13px] text-slate-700"
          dangerouslySetInnerHTML={{ __html: entry.description }}
        />
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-slate-400">
            {formatTimestamp(entry.createdAt)}
          </span>
          {entry.performedByName && (
            <span className="text-[11px] text-slate-400">
              by {entry.performedByName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
