"use client";

import { useState } from "react";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { MobileJobCard } from "./MobileJobCard";
import { DispatchJob } from "@/types/dispatch";

interface MobileUnassignedSectionProps {
  jobs: DispatchJob[];
  onJobClick: (job: DispatchJob) => void;
}

export function MobileUnassignedSection({ jobs, onJobClick }: MobileUnassignedSectionProps) {
  const [expanded, setExpanded] = useState(true);

  if (jobs.length === 0) return null;

  return (
    <div>
      <div
        className="sticky top-0 z-10 flex items-center gap-3 px-4 py-2.5 bg-red-50 border-b border-red-100 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm text-red-700">Unassigned</div>
          <div className="text-xs text-red-400">
            {jobs.length} job{jobs.length !== 1 ? "s" : ""} need a technician
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-red-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-red-400" />
        )}
      </div>

      {expanded && (
        <div className="py-2 bg-red-50/30">
          {jobs.map((job) => (
            <MobileJobCard key={job.id} job={job} onViewDetails={onJobClick} />
          ))}
        </div>
      )}
    </div>
  );
}
