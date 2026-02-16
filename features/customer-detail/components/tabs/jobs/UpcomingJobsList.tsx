"use client";

import type { Job } from "@/types/job";
import { UpcomingJobCard } from "./UpcomingJobCard";

interface UpcomingJobsListProps {
  jobs: Job[];
  onJobClick: (jobId: string) => void;
}

export function UpcomingJobsList({ jobs, onJobClick }: UpcomingJobsListProps) {
  if (jobs.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        Upcoming Jobs
      </h3>
      <div className="grid gap-3">
        {jobs.map((job) => (
          <UpcomingJobCard key={job.id} job={job} onClick={onJobClick} />
        ))}
      </div>
    </div>
  );
}
