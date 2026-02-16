"use client";

import type { DispatchJob } from "@/types/dispatch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { JobInfoSection } from "./JobInfoSection";
import { JobStatusSelect } from "./JobStatusSelect";
import { TechnicianAssignSelect } from "./TechnicianAssignSelect";
import { JobDetailPhotoGrid } from "./JobDetailPhotoGrid";

interface JobDetailDialogProps {
  job: DispatchJob | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JobDetailDialog({ job, open, onOpenChange }: JobDetailDialogProps) {
  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[820px] max-h-[85vh] overflow-y-auto p-0 gap-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-gray-200">
          <DialogTitle className="text-xl">{job.title}</DialogTitle>
          {job.description && (
            <DialogDescription>{job.description}</DialogDescription>
          )}
        </DialogHeader>

        {/* Body — two columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-6 py-5">
          {/* Left: Job info + controls */}
          <div>
            <JobInfoSection job={job} />

            <div className="border-t border-gray-200 my-4" />

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  Status
                </label>
                <JobStatusSelect job={job} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  Assigned Technician
                </label>
                <TechnicianAssignSelect job={job} />
              </div>
            </div>
          </div>

          {/* Right: Photos */}
          <div>
            <JobDetailPhotoGrid photoUrls={job.photoUrls} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-3 border-t border-gray-200">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          <a
            href={`/jobs/${job.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            View Full Job &rarr;
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
