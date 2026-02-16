"use client";

import { Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionContainer } from "./SectionContainer";
import type { ScheduleItem } from "../types";

interface TodaysScheduleProps {
  items: ScheduleItem[];
  isLoading: boolean;
}

const STATUS_DOT: Record<string, string> = {
  scheduled: "bg-green-500",
  in_progress: "bg-blue-500",
  completed: "bg-slate-400",
};

function formatTime(time: string): string {
  if (!time || time === "TBD") return "TBD";
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "p" : "a";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${m}${ampm}`;
}

export function TodaysSchedule({ items, isLoading }: TodaysScheduleProps) {
  return (
    <SectionContainer
      icon={<Clock className="h-4 w-4 text-orange-500" />}
      title="Today's Schedule"
      badge={`${items.length} jobs`}
    >
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="w-10 h-3" />
              <Skeleton className="w-1.5 h-1.5 rounded-full" />
              <Skeleton className="h-3 flex-1" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-4">No jobs scheduled today</p>
      ) : (
        <div className="-mx-4 divide-y divide-slate-50">
          {items.map(item => (
            <div key={item.id} className="px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer">
              <span className="text-xs font-mono text-slate-400 w-12 flex-shrink-0">
                {formatTime(item.time)}
              </span>
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[item.status] || STATUS_DOT.scheduled}`} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-700 truncate">
                  {item.customerName} - {item.jobTitle}
                </p>
                {item.assignedTo && (
                  <p className="text-[10px] text-slate-400 truncate">{item.assignedTo}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
