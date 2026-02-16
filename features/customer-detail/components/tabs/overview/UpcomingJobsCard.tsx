"use client";

import { Calendar, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@/types/job";
import { JOB_STATUS_COLORS, JOB_STATUS_LABELS } from "@/types/job";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

interface UpcomingJobsCardProps {
  jobs: Job[];
  isLoading?: boolean;
}

export function UpcomingJobsCard({ jobs, isLoading }: UpcomingJobsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Upcoming Jobs</CardTitle>
        <Button variant="link" size="sm" className="text-blue-600">View All</Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-24 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : jobs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming jobs</p>
        ) : (
          <div className="space-y-3">
            {jobs.slice(0, 3).map((job) => (
              <div key={job.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{job.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(job.scheduledDate)}
                      {job.scheduledTime && ` at ${job.scheduledTime}`}
                    </div>
                  </div>
                </div>
                <Badge className={JOB_STATUS_COLORS[job.status]}>
                  {JOB_STATUS_LABELS[job.status]}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
