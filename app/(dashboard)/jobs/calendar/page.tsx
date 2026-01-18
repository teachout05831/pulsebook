"use client";

import { useState, useMemo } from "react";
import { useList } from "@refinedev/core";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, List } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Job, JobStatus } from "@/types";
import { JOB_STATUS_COLORS } from "@/types";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  jobs: Job[];
}

function getCalendarDays(year: number, month: number, jobs: Job[]): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const days: CalendarDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const current = new Date(startDate);
  while (current <= lastDay || days.length % 7 !== 0) {
    const dateStr = current.toISOString().split("T")[0];
    const dayJobs = jobs.filter(j => j.scheduledDate === dateStr);

    days.push({
      date: new Date(current),
      isCurrentMonth: current.getMonth() === month,
      isToday: current.getTime() === today.getTime(),
      jobs: dayJobs,
    });
    current.setDate(current.getDate() + 1);

    if (days.length > 42) break; // Max 6 weeks
  }

  return days;
}

function JobBadge({ job, onClick }: { job: Job; onClick: () => void }) {
  const statusColor = JOB_STATUS_COLORS[job.status as JobStatus];
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`w-full text-left px-1.5 py-0.5 rounded text-xs truncate ${statusColor} hover:opacity-80 transition-opacity`}
    >
      {job.scheduledTime ? `${job.scheduledTime.slice(0, 5)} ` : ""}{job.title}
    </button>
  );
}

function CalendarSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    </div>
  );
}

export default function JobsCalendarPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Fetch all jobs for the visible month range (include prev/next month days visible)
  const startOfRange = new Date(year, month, 1);
  startOfRange.setDate(startOfRange.getDate() - 7);
  const endOfRange = new Date(year, month + 1, 7);

  const { query, result } = useList<Job>({
    resource: "jobs",
    pagination: {
      currentPage: 1,
      pageSize: 100, // Get all jobs for the month
    },
  });

  const { isLoading } = query;
  const jobs = result.data ?? [];

  const calendarDays = useMemo(() => {
    return getCalendarDays(year, month, jobs);
  }, [year, month, jobs]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleJobClick = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  const handleDayClick = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    router.push(`/jobs/new?date=${dateStr}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">
            View and manage jobs by date.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/jobs")}>
          <List className="mr-2 h-4 w-4" />
          List View
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-xl min-w-[200px] text-center">
                {MONTHS[month]} {year}
              </CardTitle>
              <Button variant="outline" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" onClick={goToToday}>
              Today
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <CalendarSkeleton />
          ) : (
            <div className="border rounded-lg overflow-hidden">
              {/* Day headers */}
              <div className="grid grid-cols-7 bg-muted">
                {DAYS_OF_WEEK.map((day) => (
                  <div
                    key={day}
                    className="p-2 text-center text-sm font-medium border-b"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    onClick={() => handleDayClick(day.date)}
                    className={`
                      min-h-[100px] p-1 border-b border-r cursor-pointer
                      hover:bg-muted/50 transition-colors
                      ${!day.isCurrentMonth ? "bg-muted/30 text-muted-foreground" : ""}
                      ${day.isToday ? "bg-blue-50 dark:bg-blue-950/20" : ""}
                      ${index % 7 === 6 ? "border-r-0" : ""}
                    `}
                  >
                    <div className={`
                      text-sm font-medium mb-1
                      ${day.isToday ? "text-blue-600 dark:text-blue-400" : ""}
                    `}>
                      {day.date.getDate()}
                    </div>
                    <div className="space-y-0.5">
                      {day.jobs.slice(0, 3).map((job) => (
                        <JobBadge
                          key={job.id}
                          job={job}
                          onClick={() => handleJobClick(job.id)}
                        />
                      ))}
                      {day.jobs.length > 3 && (
                        <div className="text-xs text-muted-foreground px-1">
                          +{day.jobs.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 text-sm">
            <span className="text-muted-foreground">Status:</span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">Scheduled</Badge>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">In Progress</Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">Cancelled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
