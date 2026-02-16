"use client";

import { useState } from "react";
import { DispatchJob } from "@/types/dispatch";
import { useDispatch } from "../dispatch-provider";
import { cn } from "@/lib/utils";

interface JobStatusSelectProps {
  job: DispatchJob;
}

const statusLabels: Record<DispatchJob["status"], string> = {
  unassigned: "Unassigned",
  scheduled: "Scheduled",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusStyles: Record<DispatchJob["status"], string> = {
  unassigned: "text-red-600",
  scheduled: "text-blue-600",
  in_progress: "text-yellow-600",
  completed: "text-green-600",
  cancelled: "text-gray-600",
};

export function JobStatusSelect({ job }: JobStatusSelectProps) {
  const { optimisticUpdateJobStatus, updateJob } = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: DispatchJob["status"]) => {
    if (newStatus === job.status) return;

    setIsLoading(true);
    optimisticUpdateJobStatus(job.id, newStatus);

    try {
      await updateJob(job.id, { status: newStatus });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <select
      value={job.status}
      onChange={(e) => handleStatusChange(e.target.value as DispatchJob["status"])}
      disabled={isLoading}
      className={cn(
        "w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
        statusStyles[job.status],
        isLoading && "opacity-50"
      )}
    >
      {(Object.keys(statusLabels) as DispatchJob["status"][]).map((status) => (
        <option key={status} value={status}>
          {statusLabels[status]}
        </option>
      ))}
    </select>
  );
}
