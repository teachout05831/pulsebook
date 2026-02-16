"use client";

import { AlertCircle } from "lucide-react";
import type { DispatchJob } from "@/types/dispatch";
import { Badge } from "@/components/ui/badge";
import { ResourceJobCard } from "./ResourceJobCard";

export function UnassignedJobsPanel({
  jobs,
  onJobClick,
}: {
  jobs: DispatchJob[];
  onJobClick: (job: DispatchJob) => void;
}) {
  if (jobs.length === 0) return null;

  return (
    <div className="bg-red-50 rounded-lg border border-red-200 overflow-hidden mb-6">
      <div className="flex items-center gap-3 p-4 bg-red-100">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <h3 className="font-semibold text-red-800">Unassigned Jobs</h3>
        <Badge variant="destructive">{jobs.length}</Badge>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-4 gap-2">
          {jobs.map(job => (
            <ResourceJobCard key={job.id} job={job} onClick={() => onJobClick(job)} compact />
          ))}
        </div>
      </div>
    </div>
  );
}
