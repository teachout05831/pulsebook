"use client";

import { Clock } from "lucide-react";
import type { DispatchJob } from "@/types/dispatch";
import { cn } from "@/lib/utils";
import { statusColors, statusBgColors } from "./resource-helpers";

interface ResourceJobCardProps {
  job: DispatchJob;
  onClick: () => void;
  compact?: boolean;
}

export function ResourceJobCard({ job, onClick, compact = false }: ResourceJobCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-md border p-2 cursor-pointer transition-all hover:shadow-md",
        statusBgColors[job.status]
      )}
    >
      <div className="flex items-start gap-2">
        <div className={cn("w-1.5 h-full min-h-[40px] rounded-full flex-shrink-0", statusColors[job.status])} />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-gray-900 truncate">{job.title}</div>
          {!compact && (
            <>
              <div className="text-xs text-gray-600 truncate">{job.customerName}</div>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-0.5">
                  <Clock className="w-3 h-3" />
                  {job.scheduledTime || "TBD"}
                </span>
                {job.estimatedDuration && (
                  <span>{job.estimatedDuration}min</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
