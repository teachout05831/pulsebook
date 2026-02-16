"use client";

import React from "react";
import { DispatchJob } from "@/types/dispatch";
import { cn } from "@/lib/utils";

interface JobBlockProps {
  job: DispatchJob;
  onClick?: () => void;
  compact?: boolean;
}

const statusStyles: Record<DispatchJob["status"], string> = {
  unassigned: "bg-gradient-to-br from-red-50 to-red-100 border-l-red-500",
  scheduled: "bg-gradient-to-br from-blue-50 to-blue-100 border-l-blue-500",
  in_progress: "bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-yellow-500",
  completed: "bg-gradient-to-br from-green-50 to-green-100 border-l-green-500",
  cancelled: "bg-gradient-to-br from-gray-50 to-gray-100 border-l-gray-400",
};

export const JobBlock = React.memo(function JobBlock({ job, onClick, compact = false }: JobBlockProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-md border-l-[3px] p-2 cursor-pointer shadow-sm",
        "transition-all duration-150 hover:scale-[1.02] hover:shadow-md hover:z-10",
        statusStyles[job.status],
        compact ? "text-[10px]" : "text-[11px]"
      )}
    >
      <div className="font-semibold text-gray-900 truncate">
        {job.title}
      </div>
      {!compact && (
        <>
          <div className="text-gray-600 truncate">{job.customerName}</div>
          <div className="text-gray-500 text-[10px]">
            {job.scheduledTime || "TBD"} • {job.estimatedDuration}min
          </div>
        </>
      )}
    </div>
  );
});
