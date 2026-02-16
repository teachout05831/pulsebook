"use client";

import { useDispatch } from "../../dispatch-provider";
import type { DispatchJob } from "@/types/dispatch";
import { cn } from "@/lib/utils";
import { getJobPosition, statusColors } from "./week-helpers";

interface WeekJobProps {
  job: DispatchJob;
  onClick: () => void;
}

export function WeekJob({ job, onClick }: WeekJobProps) {
  const { top, height } = getJobPosition(job);
  const { technicians } = useDispatch();
  const technician = technicians.find(t => t.id === job.assignedTechnicianId);

  return (
    <div
      onClick={onClick}
      className={cn(
        "absolute left-1 right-1 rounded-md p-1.5 overflow-hidden cursor-pointer",
        "border-l-[3px] text-xs transition-all hover:shadow-lg hover:z-20",
        job.status === "unassigned" && "bg-red-50 border-l-red-500",
        job.status === "scheduled" && "bg-blue-50 border-l-blue-500",
        job.status === "in_progress" && "bg-yellow-50 border-l-yellow-500",
        job.status === "completed" && "bg-green-50 border-l-green-500",
        job.status === "cancelled" && "bg-gray-100 border-l-gray-400"
      )}
      style={{ top, height: Math.max(height, 36) }}
    >
      <div className="font-semibold text-gray-900 truncate text-[11px]">{job.title}</div>
      {height >= 50 && (
        <div className="text-gray-600 truncate text-[10px]">{job.customerName}</div>
      )}
      {height >= 70 && technician && (
        <div className="flex items-center gap-1 mt-1">
          <div className={cn("w-2 h-2 rounded-full", statusColors[job.status])} />
          <span className="text-[9px] text-gray-500 truncate">{technician.name}</span>
        </div>
      )}
    </div>
  );
}
