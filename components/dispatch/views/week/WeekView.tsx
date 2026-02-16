"use client";

import { useMemo, useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch } from "../../dispatch-provider";
import { JobDetailDialog } from "../../job-details/JobDetailDialog";
import { DispatchJob } from "@/types/dispatch";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HOURS, statusColors, formatHour, getWeekDays } from "./week-helpers";
import { DayColumn } from "./DayColumn";

export function WeekView() {
  const {
    jobs,
    selectedDate,
    setSelectedDate,
    goToToday,
    setSelectedJobId,
    setIsDetailsPanelOpen,
  } = useDispatch();

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);

  const jobsByDate = useMemo(() => {
    const groups = new Map<string, DispatchJob[]>();
    weekDays.forEach(day => {
      const dateKey = day.toISOString().split("T")[0];
      groups.set(dateKey, []);
    });
    jobs.forEach(job => {
      const dateKey = job.scheduledDate;
      const current = groups.get(dateKey);
      if (current) current.push(job);
    });
    return groups;
  }, [jobs, weekDays]);

  const [dialogJob, setDialogJob] = useState<DispatchJob | null>(null);
  const lastClickRef = useRef<{ id: string; time: number }>({ id: "", time: 0 });

  const handleJobClick = useCallback((job: DispatchJob) => {
    const now = Date.now();
    if (lastClickRef.current.id === job.id && now - lastClickRef.current.time < 400) {
      setDialogJob(job);
      lastClickRef.current = { id: "", time: 0 };
      return;
    }
    lastClickRef.current = { id: job.id, time: now };
    setSelectedJobId(job.id);
    setIsDetailsPanelOpen(true);
  }, [setSelectedJobId, setIsDetailsPanelOpen]);

  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];
  const weekLabel = `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

  return (
    <>
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextWeek}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={goToToday}>Today</Button>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">{weekLabel}</h2>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{jobs.length} total jobs this week</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="flex min-h-full">
          <div className="flex-shrink-0 w-16 bg-gray-50 border-r border-gray-200">
            <div className="h-[68px] border-b border-gray-200" />
            {HOURS.map(hour => (
              <div key={hour} className="h-[60px] text-right pr-2 text-xs text-gray-500 -mt-2">
                {formatHour(hour)}
              </div>
            ))}
          </div>

          <div className="flex-1 flex">
            {weekDays.map(day => {
              const dateKey = day.toISOString().split("T")[0];
              return (
                <DayColumn key={dateKey} date={day} jobs={jobsByDate.get(dateKey) || []} onJobClick={handleJobClick} />
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 py-2 border-t border-gray-200 bg-gray-50 text-xs">
        {Object.entries(statusColors).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1.5">
            <div className={cn("w-2.5 h-2.5 rounded-full", color)} />
            <span className="text-gray-600 capitalize">{status.replace("_", " ")}</span>
          </div>
        ))}
      </div>
    </div>
    <JobDetailDialog job={dialogJob} open={!!dialogJob} onOpenChange={(o) => { if (!o) setDialogJob(null); }} />
    </>
  );
}
