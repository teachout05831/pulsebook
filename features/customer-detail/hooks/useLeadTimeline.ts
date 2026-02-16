"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { Interaction } from "@/features/interactions/types";
import type { TimelineEntryData } from "@/features/interactions/components/TimelineEntry";
import { INTERACTION_TYPE_LABELS } from "@/features/interactions/types";
import { parseFollowUpDueDate } from "@/features/follow-ups/types";

type TimelineFilter = "all" | "calls" | "texts" | "emails" | "meetings" | "system";

function interactionToEntry(i: Interaction): TimelineEntryData {
  return {
    id: i.id,
    source: "interaction",
    type: i.type,
    title: INTERACTION_TYPE_LABELS[i.type] || i.type,
    description: i.details,
    outcome: i.outcome,
    timestamp: i.createdAt,
    performedByName: i.performedByName,
    durationSeconds: i.durationSeconds,
  };
}

function followUpToEntry(f: { id: string; type: string; details: string | null; dueDate: string; status: string }): TimelineEntryData {
  const isCompleted = f.status === "completed";
  const { correctedTimestamp, displayTime } = parseFollowUpDueDate(f.dueDate);
  return {
    id: `fu-${f.id}`,
    source: "follow_up",
    type: "follow_up",
    title: isCompleted ? "Follow-up Completed" : "Follow-up Due",
    description: f.details ? `${f.type} — "${f.details}"` : f.type,
    outcome: null,
    timestamp: correctedTimestamp,
    performedByName: null,
    hideTime: !displayTime,
  };
}

export function useLeadTimeline(customerId: string, interactions: Interaction[], followUps: { id: string; type: string; details: string | null; dueDate: string; status: string }[]) {
  const [filter, setFilter] = useState<TimelineFilter>("all");

  const entries = useMemo(() => {
    const items: TimelineEntryData[] = [
      ...interactions.map(interactionToEntry),
      ...followUps.map(followUpToEntry),
    ];

    items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return items;
  }, [interactions, followUps]);

  const filtered = useMemo(() => {
    if (filter === "all") return entries;
    const typeMap: Record<string, string> = {
      calls: "call", texts: "text", emails: "email", meetings: "meeting",
    };
    if (filter === "system") return entries.filter((e) => e.source === "follow_up" || e.source === "system");
    return entries.filter((e) => e.type === typeMap[filter]);
  }, [entries, filter]);

  const grouped = useMemo(() => {
    const groups: Record<string, TimelineEntryData[]> = {};
    for (const entry of filtered) {
      const date = new Date(entry.timestamp).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
      if (!groups[date]) groups[date] = [];
      groups[date].push(entry);
    }
    return groups;
  }, [filtered]);

  return { entries: filtered, grouped, filter, setFilter, totalCount: entries.length };
}
