"use client";

import type { DispatchJob } from "@/types/dispatch";
import { JobStatusSelect } from "../../../job-details/JobStatusSelect";
import { TechnicianAssignSelect } from "../../../job-details/TechnicianAssignSelect";

interface MobileJobControlsProps {
  job: DispatchJob;
}

export function MobileJobControls({ job }: MobileJobControlsProps) {
  return (
    <div className="border-t border-gray-200 pt-4 space-y-3">
      <div>
        <label className="text-xs text-gray-500 font-medium mb-1.5 block">
          Status
        </label>
        <JobStatusSelect job={job} />
      </div>
      <div>
        <label className="text-xs text-gray-500 font-medium mb-1.5 block">
          Assigned Technician
        </label>
        <TechnicianAssignSelect job={job} />
      </div>
    </div>
  );
}
