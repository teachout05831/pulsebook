"use client";

import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink } from "lucide-react";
import { JOB_STATUS_COLORS, JOB_STATUS_LABELS } from "@/types/job";
import { useJobDetail } from "../../../hooks/useJobDetail";
import { JobDetailContent } from "./JobDetailContent";

interface JobDetailSheetProps {
  jobId: string | null;
  open: boolean;
  onClose: () => void;
}

export function JobDetailSheet({ jobId, open, onClose }: JobDetailSheetProps) {
  const router = useRouter();
  const { job, isLoading } = useJobDetail(open ? jobId : null);

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="p-0 w-[440px] sm:max-w-[440px] flex flex-col">
        {/* Dark header */}
        <div className="bg-slate-800 text-white px-5 py-4 sticky top-0 z-10">
          <SheetHeader>
            <SheetTitle className="text-white font-semibold text-base flex items-center gap-2">
              {isLoading ? "Loading..." : job?.title || "Job Details"}
              {job && (
                <Badge className={`${JOB_STATUS_COLORS[job.status]} text-xs`}>
                  {JOB_STATUS_LABELS[job.status]}
                </Badge>
              )}
            </SheetTitle>
            <SheetDescription className="sr-only">Job detail panel</SheetDescription>
          </SheetHeader>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : job ? (
            <JobDetailContent job={job} onNavigate={router.push} />
          ) : (
            <div className="text-center py-12 text-muted-foreground">Job not found</div>
          )}
        </div>

        {/* Footer */}
        {job && (
          <div className="border-t px-5 py-3">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => {
                onClose();
                router.push(`/jobs/${job.id}`);
              }}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Full Details
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
