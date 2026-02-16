"use client";

import type { DispatchJob } from "@/types/dispatch";
import { cn } from "@/lib/utils";
import { HOURS, formatDayHeader } from "./week-helpers";
import { WeekJob } from "./WeekJob";

interface DayColumnProps {
  date: Date;
  jobs: DispatchJob[];
  onJobClick: (job: DispatchJob) => void;
}

export function DayColumn({ date, jobs, onJobClick }: DayColumnProps) {
  const { day, date: dateNum, isToday } = formatDayHeader(date);

  return (
    <div className="flex flex-col flex-1 min-w-[120px]">
      <div
        className={cn(
          "text-center py-2 border-b border-gray-200 sticky top-0 bg-white z-10",
          isToday && "bg-blue-50"
        )}
      >
        <div className={cn("text-xs font-medium", isToday ? "text-blue-600" : "text-gray-500")}>
          {day}
        </div>
        <div className={cn("text-lg font-bold mt-0.5", isToday ? "text-blue-600" : "text-gray-900")}>
          {dateNum}
        </div>
        <div className="text-[10px] text-gray-400 mt-0.5">{jobs.length} jobs</div>
      </div>

      <div className="relative flex-1">
        {HOURS.map((hour) => (
          <div
            key={hour}
            className={cn(
              "border-b border-gray-100 h-[60px]",
              isToday && new Date().getHours() === hour && "bg-blue-50/30"
            )}
          />
        ))}
        {jobs.map(job => (
          <WeekJob key={job.id} job={job} onClick={() => onJobClick(job)} />
        ))}
      </div>
    </div>
  );
}
