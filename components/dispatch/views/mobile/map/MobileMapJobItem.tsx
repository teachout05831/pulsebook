"use client";

import type { DispatchJob } from "@/types/dispatch";
import { cn } from "@/lib/utils";

interface MobileMapJobItemProps {
  job: DispatchJob;
  index: number;
  onViewDetails: (job: DispatchJob) => void;
}

const pinColor: Record<DispatchJob["status"], string> = {
  unassigned: "bg-red-500",
  scheduled: "bg-blue-500",
  in_progress: "bg-yellow-500",
  completed: "bg-green-500",
  cancelled: "bg-gray-400",
};

const statusText: Record<DispatchJob["status"], { label: string; color: string }> = {
  unassigned: { label: "Unassigned", color: "text-red-600" },
  scheduled: { label: "Scheduled", color: "text-blue-600" },
  in_progress: { label: "Active", color: "text-yellow-600" },
  completed: { label: "Done", color: "text-green-600" },
  cancelled: { label: "Cancelled", color: "text-gray-600" },
};

export { pinColor };

export function MobileMapJobItem({ job, index, onViewDetails }: MobileMapJobItemProps) {
  return (
    <div
      onClick={() => onViewDetails(job)}
      className={cn(
        "bg-white rounded-lg border border-gray-200 p-3 mb-2 flex items-center gap-3 cursor-pointer active:bg-gray-50",
        job.status === "completed" && "opacity-50"
      )}
    >
      <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0", pinColor[job.status])}>
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-gray-900 truncate">{job.title}</div>
        <div className="text-xs text-gray-500">
          {job.scheduledTime || "TBD"} &bull; {job.customerName}
        </div>
      </div>
      <span className={cn("text-xs font-medium flex-shrink-0", statusText[job.status].color)}>
        {statusText[job.status].label}
      </span>
    </div>
  );
}
