"use client";

import { useMemo } from "react";
import { X } from "lucide-react";
import { useDispatch } from "../dispatch-provider";
import { JobInfoSection } from "./JobInfoSection";
import { JobStatusSelect } from "./JobStatusSelect";
import { TechnicianAssignSelect } from "./TechnicianAssignSelect";
import { PhotoCarousel } from "./PhotoCarousel";
import { QuickActions } from "./QuickActions";
import { cn } from "@/lib/utils";

export function JobDetailsPanel() {
  const {
    jobs,
    selectedJobId,
    isDetailsPanelOpen,
    setIsDetailsPanelOpen,
    setSelectedJobId,
  } = useDispatch();

  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId) ?? null,
    [jobs, selectedJobId]
  );

  const closePanel = () => {
    setIsDetailsPanelOpen(false);
    setSelectedJobId(null);
  };

  return (
    <div
      className={cn(
        "absolute right-0 top-0 bottom-0 w-[380px] bg-white border-l border-gray-200 z-[1200] flex flex-col shadow-[-4px_0_20px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        isDetailsPanelOpen && selectedJob ? "translate-x-0" : "translate-x-full"
      )}
    >
      {selectedJob && (
        <>
          {/* Header */}
          <div className="flex justify-between items-start px-4 pt-3.5 pb-2.5 border-b border-gray-200">
            <div className="flex-1 min-w-0 mr-2">
              <h3 className="text-base font-semibold text-gray-900 leading-tight">{selectedJob.title}</h3>
              {selectedJob.description && (
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{selectedJob.description}</p>
              )}
            </div>
            <button
              onClick={closePanel}
              className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Photo Carousel */}
          <PhotoCarousel jobId={selectedJob.id} photoUrls={selectedJob.photoUrls} />

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-4 py-3.5">
            <JobInfoSection job={selectedJob} />

            <div className="border-t border-gray-200 my-3" />

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-gray-600 mb-1 block">Status</label>
                <JobStatusSelect job={selectedJob} />
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-600 mb-1 block">Assigned Technician</label>
                <TechnicianAssignSelect job={selectedJob} />
              </div>
            </div>

            <div className="border-t border-gray-200 my-3" />

            <div>
              <label className="text-[11px] font-medium text-gray-600 mb-1.5 block">Quick Actions</label>
              <QuickActions job={selectedJob} />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-2 px-4 py-2.5 border-t border-gray-200">
            <button
              onClick={closePanel}
              className="px-3.5 py-2 text-xs font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <a
              href={`/jobs/${selectedJob.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center px-3.5 py-2 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              View Full Job &rarr;
            </a>
          </div>
        </>
      )}
    </div>
  );
}
