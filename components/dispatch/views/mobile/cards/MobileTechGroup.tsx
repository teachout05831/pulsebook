"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TechnicianAvatar } from "../../../shared/technician-avatar";
import { MobileJobCard } from "./MobileJobCard";
import { DispatchTechnician, DispatchJob } from "@/types/dispatch";

interface MobileTechGroupProps {
  technician: DispatchTechnician;
  jobs: DispatchJob[];
  onJobClick: (job: DispatchJob) => void;
}

function sortByTime(a: DispatchJob, b: DispatchJob): number {
  const timeA = a.scheduledTime || "99:99";
  const timeB = b.scheduledTime || "99:99";
  return timeA.localeCompare(timeB);
}

export function MobileTechGroup({ technician, jobs, onJobClick }: MobileTechGroupProps) {
  const [expanded, setExpanded] = useState(true);
  const completedCount = jobs.filter((j) => j.status === "completed").length;
  const sortedJobs = [...jobs].sort(sortByTime);

  return (
    <div>
      {/* Sticky technician header */}
      <div
        className="sticky top-0 z-10 flex items-center gap-3 px-4 py-2.5 bg-white border-b border-gray-100 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <TechnicianAvatar technician={technician} size="md" showStatus />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-gray-900">{technician.name}</div>
          <div className="text-xs text-gray-400">
            {jobs.length} job{jobs.length !== 1 ? "s" : ""} &middot; {completedCount} done
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </div>

      {/* Job cards */}
      {expanded && (
        <div className="py-2 bg-gray-50">
          {sortedJobs.map((job) => (
            <MobileJobCard key={job.id} job={job} onViewDetails={onJobClick} />
          ))}
        </div>
      )}
    </div>
  );
}
