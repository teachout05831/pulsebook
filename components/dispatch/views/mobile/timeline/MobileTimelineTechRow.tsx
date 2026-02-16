"use client";

import { useMemo } from "react";
import { useDispatch } from "../../../dispatch-provider";
import { HOURS, CELL_WIDTH, START_HOUR, getJobPosition } from "../../timeline/constants";
import type { DispatchJob, DispatchTechnician } from "@/types/dispatch";
import { cn } from "@/lib/utils";

interface MobileTimelineTechRowProps {
  technician?: DispatchTechnician;
  jobs: DispatchJob[];
  isUnassigned?: boolean;
  nowOffset: number;
  onJobClick: (job: DispatchJob) => void;
}

const MOBILE_CELL = 80; // px per hour on mobile (compact)
const BLOCK_HEIGHT = 34;
const BLOCK_TOP = 14;

const jobBlockStyle: Record<DispatchJob["status"], string> = {
  unassigned: "bg-red-100 border-red-300 border-dashed text-red-700",
  scheduled: "bg-blue-100 border-blue-300 text-blue-700",
  in_progress: "bg-yellow-100 border-yellow-400 text-yellow-800",
  completed: "bg-green-100 border-green-300 text-green-700",
  cancelled: "bg-gray-100 border-gray-300 text-gray-500",
};

function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export function MobileTimelineTechRow({
  technician,
  jobs,
  isUnassigned,
  nowOffset,
  onJobClick,
}: MobileTimelineTechRowProps) {
  const totalWidth = HOURS.length * MOBILE_CELL;

  const jobPositions = useMemo(
    () => jobs.map((job) => ({ job, ...getJobPosition(job, MOBILE_CELL) })),
    [jobs]
  );

  const jobCount = jobs.length;
  const hasActiveJob = jobs.some((j) => j.status === "in_progress");

  return (
    <div className="border-b border-gray-200">
      {/* Tech header */}
      <div className={cn("flex items-center gap-2 px-3 py-2 sticky top-0 z-10", isUnassigned ? "bg-red-50" : "bg-gray-50")}>
        {isUnassigned ? (
          <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-[10px] font-bold flex-shrink-0">!</div>
        ) : (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
            style={{ backgroundColor: technician?.color || "#6b7280" }}
          >
            {technician ? getInitials(technician.name) : "?"}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className={cn("text-sm font-medium truncate", isUnassigned ? "text-red-700" : "text-gray-900")}>
            {isUnassigned ? "Unassigned" : technician?.name}
          </div>
          <div className={cn("text-[10px]", isUnassigned ? "text-red-500" : "text-gray-500")}>
            {jobCount} job{jobCount !== 1 ? "s" : ""}{!isUnassigned && (hasActiveJob ? " \u2022 On Job" : " \u2022 Available")}
            {isUnassigned && jobCount > 0 && " need assignment"}
          </div>
        </div>
        {!isUnassigned && (
          <span className={cn("w-2 h-2 rounded-full flex-shrink-0", hasActiveJob ? "bg-yellow-500" : "bg-green-500")} />
        )}
      </div>

      {/* Timeline row */}
      <div className="overflow-x-auto scrollbar-hide relative" style={{ height: 56 }}>
        <div className="relative" style={{ width: totalWidth, height: 56 }}>
          {/* Hour grid lines */}
          {HOURS.slice(1).map((hour) => (
            <div
              key={hour}
              className="absolute top-0 bottom-0 w-px bg-gray-100"
              style={{ left: (hour - START_HOUR) * MOBILE_CELL }}
            />
          ))}

          {/* Time labels */}
          {HOURS.map((hour) => (
            <div
              key={`label-${hour}`}
              className="absolute top-0 text-[9px] text-gray-400 px-1"
              style={{ left: (hour - START_HOUR) * MOBILE_CELL }}
            >
              {hour > 12 ? hour - 12 : hour}{hour >= 12 ? "PM" : "AM"}
            </div>
          ))}

          {/* Now line */}
          {nowOffset >= 0 && nowOffset <= totalWidth && (
            <div className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10" style={{ left: nowOffset }}>
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full" />
            </div>
          )}

          {/* Job blocks */}
          {jobPositions.length === 0 && !isUnassigned && (
            <div className="absolute top-[18px] left-[80px] text-[10px] text-gray-300 italic">
              No jobs scheduled
            </div>
          )}
          {jobPositions.map(({ job, left, width }) => (
            <div
              key={job.id}
              onClick={() => onJobClick(job)}
              className={cn(
                "absolute rounded-md border px-2 flex items-center overflow-hidden cursor-pointer",
                jobBlockStyle[job.status]
              )}
              style={{ top: BLOCK_TOP, left, width, height: BLOCK_HEIGHT }}
            >
              <span className="text-[10px] font-medium truncate">{job.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
