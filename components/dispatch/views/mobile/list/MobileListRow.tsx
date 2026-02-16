"use client";

import type { DispatchJob } from "@/types/dispatch";
import { cn } from "@/lib/utils";

interface MobileListRowProps {
  job: DispatchJob;
  onViewDetails: (job: DispatchJob) => void;
}

const statusBarColor: Record<DispatchJob["status"], string> = {
  unassigned: "bg-red-500",
  scheduled: "bg-blue-500",
  in_progress: "bg-yellow-500",
  completed: "bg-green-500",
  cancelled: "bg-gray-400",
};

const statusLabel: Record<DispatchJob["status"], string> = {
  unassigned: "UNASSIGNED",
  scheduled: "SCHED",
  in_progress: "ACTIVE",
  completed: "DONE",
  cancelled: "CANCEL",
};

const statusBadge: Record<DispatchJob["status"], string> = {
  unassigned: "bg-red-100 text-red-700",
  scheduled: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-700",
};

function formatDuration(minutes: number) {
  if (minutes < 60) return `~${minutes}m`;
  const hrs = Math.round(minutes / 60);
  return `~${hrs} hr${hrs > 1 ? "s" : ""}`;
}

export function MobileListRow({ job, onViewDetails }: MobileListRowProps) {
  const assignee = job.assignedTechnicianName || job.assignedCrewName;
  const initial = assignee ? assignee.charAt(0).toUpperCase() : null;

  return (
    <div
      onClick={() => onViewDetails(job)}
      className={cn(
        "flex items-center px-3 py-3 border-b border-gray-100 active:bg-gray-50 cursor-pointer",
        job.status === "completed" && "opacity-50"
      )}
    >
      <div className={cn("w-1 h-10 rounded-full mr-3 flex-shrink-0", statusBarColor[job.status])} />
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-gray-900 truncate block">
          {job.title}
        </span>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
          <span>{job.scheduledTime || "TBD"}</span>
          <span className="text-gray-300">|</span>
          <span className="truncate">{job.customerName}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
        <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium", statusBadge[job.status])}>
          {statusLabel[job.status]}
        </span>
        <div className="flex items-center gap-1">
          {initial && (
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-[7px] font-bold">
              {initial}
            </div>
          )}
          <span className="text-[10px] text-gray-400">
            {formatDuration(job.estimatedDuration)}
          </span>
        </div>
      </div>
    </div>
  );
}
