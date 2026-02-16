"use client";

import { Wrench, Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@/types/job";
import { JOB_STATUS_COLORS, JOB_STATUS_LABELS } from "@/types/job";
import { RecurringBadge } from "@/features/recurring-jobs";

function formatDateTime(dateStr: string, timeStr: string | null): string {
  const date = new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
  return timeStr ? `${date} @ ${timeStr}` : date;
}

interface UpcomingJobCardProps {
  job: Job;
  onClick: (jobId: string) => void;
}

export function UpcomingJobCard({ job, onClick }: UpcomingJobCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(job.id)}
    >
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100">
            <Wrench className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 font-medium">
              <span className="truncate">{job.title}</span>
              {job.isRecurringTemplate && job.recurrenceConfig && (
                <RecurringBadge config={job.recurrenceConfig} />
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatDateTime(job.scheduledDate, job.scheduledTime)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          {job.assignedTo && (
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                {job.assignedTo}
              </div>
              <div className="text-xs text-muted-foreground">Technician</div>
            </div>
          )}
          <Badge className={JOB_STATUS_COLORS[job.status]}>
            {JOB_STATUS_LABELS[job.status]}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
