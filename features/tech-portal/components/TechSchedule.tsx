"use client";

import { useState } from "react";
import { Calendar, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TechJobCard } from "./TechJobCard";
import { useTechJobs } from "../hooks/useTechJobs";

type DateRange = "today" | "tomorrow" | "week";

function getDateRange(range: DateRange): { start: string; end: string } {
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().split("T")[0];

  if (range === "today") {
    return { start: fmt(today), end: fmt(today) };
  }
  if (range === "tomorrow") {
    const tmw = new Date(today);
    tmw.setDate(tmw.getDate() + 1);
    return { start: fmt(tmw), end: fmt(tmw) };
  }
  const endOfWeek = new Date(today);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  return { start: fmt(today), end: fmt(endOfWeek) };
}

function formatDateHeader(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const tmw = new Date(today);
  tmw.setDate(tmw.getDate() + 1);
  const tmwStr = tmw.toISOString().split("T")[0];

  if (dateStr === todayStr) return "Today";
  if (dateStr === tmwStr) return "Tomorrow";
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function TechSchedule() {
  const [range, setRange] = useState<DateRange>("today");
  const { start, end } = getDateRange(range);
  const { jobs, isLoading, refresh } = useTechJobs(start, end);

  // Group jobs by date
  const grouped = jobs.reduce<Record<string, typeof jobs>>((acc, job) => {
    const date = job.scheduledDate;
    if (!acc[date]) acc[date] = [];
    acc[date].push(job);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["today", "tomorrow", "week"] as DateRange[]).map((r) => (
          <Button
            key={r}
            variant={range === r ? "default" : "outline"}
            size="sm"
            onClick={() => setRange(r)}
            className="capitalize"
          >
            {r === "week" ? "This Week" : r}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={refresh}
          disabled={isLoading}
          className="ml-auto"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground font-medium">No jobs scheduled</p>
          <p className="text-sm text-muted-foreground">
            {range === "today"
              ? "You have no jobs for today"
              : range === "tomorrow"
                ? "You have no jobs for tomorrow"
                : "No jobs this week"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date} className="space-y-2">
              {range === "week" && (
                <h3 className="text-sm font-medium text-muted-foreground px-1">
                  {formatDateHeader(date)}
                </h3>
              )}
              <div className="space-y-2">
                {grouped[date].map((job) => (
                  <TechJobCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
