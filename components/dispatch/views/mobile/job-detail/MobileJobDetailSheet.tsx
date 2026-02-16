"use client";

import { useMemo } from "react";
import { ExternalLink } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useDispatch } from "../../../dispatch-provider";
import { MobileJobInfo } from "./MobileJobInfo";
import { MobileQuickActions } from "./MobileQuickActions";
import { MobileJobControls } from "./MobileJobControls";
import { MobileCustomFields } from "./MobileCustomFields";
import { cn } from "@/lib/utils";
import Link from "next/link";

const statusBadge: Record<string, string> = {
  unassigned: "bg-red-100 text-red-700",
  scheduled: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-700",
};

const statusLabels: Record<string, string> = {
  unassigned: "Unassigned",
  scheduled: "Scheduled",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const priorityBadge: Record<string, string> = {
  low: "bg-gray-100 text-gray-700",
  normal: "bg-blue-100 text-blue-700",
  high: "bg-amber-100 text-amber-700",
  urgent: "bg-red-100 text-red-700",
};

export function MobileJobDetailSheet() {
  const {
    jobs,
    selectedJobId,
    isDetailsPanelOpen,
    setIsDetailsPanelOpen,
    setSelectedJobId,
  } = useDispatch();

  const selectedJob = useMemo(
    () => jobs.find((j) => j.id === selectedJobId) ?? null,
    [jobs, selectedJobId]
  );

  const handleClose = (open: boolean) => {
    if (!open) {
      setIsDetailsPanelOpen(false);
      setSelectedJobId(null);
    }
  };

  return (
    <Sheet open={isDetailsPanelOpen && !!selectedJob} onOpenChange={handleClose}>
      <SheetContent
        side="bottom"
        className="rounded-t-[20px] p-0 max-h-[85vh] flex flex-col [&>button:last-child]:hidden"
      >
        {selectedJob && (
          <>
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-4 pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", statusBadge[selectedJob.status])}>
                  {statusLabels[selectedJob.status]}
                </span>
                {selectedJob.priority !== "normal" && (
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium uppercase", priorityBadge[selectedJob.priority])}>
                    {selectedJob.priority}
                  </span>
                )}
                {selectedJob.jobType && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-100 text-indigo-700">
                    {selectedJob.jobType}
                  </span>
                )}
              </div>
              <SheetTitle className="text-lg font-semibold text-gray-900">
                {selectedJob.title}
              </SheetTitle>
              {selectedJob.description && (
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{selectedJob.description}</p>
              )}
              <SheetDescription className="sr-only">Job details</SheetDescription>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              <MobileJobInfo job={selectedJob} />
              <MobileQuickActions job={selectedJob} />
              <MobileJobControls job={selectedJob} />

              {selectedJob.notes && (
                <div className="border-t border-gray-200 pt-4">
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Notes</label>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">
                    {selectedJob.notes}
                  </p>
                </div>
              )}

              <MobileCustomFields customFields={selectedJob.customFields} />
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-200">
              <Link
                href={`/jobs/${selectedJob.id}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => handleClose(false)}
              >
                View Full Job
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
