"use client";

import { memo, useMemo } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { DraggableJob } from "../../dnd";
import type { DispatchJob } from "@/types/dispatch";
import { Badge } from "@/components/ui/badge";
import { DispatchBoardJob } from "./DispatchBoardJob";

export const UnassignedColumn = memo(function UnassignedColumn({
  jobs,
  selectedJobId,
  onJobSelect,
}: {
  jobs: DispatchJob[];
  selectedJobId: string | null;
  onJobSelect: (job: DispatchJob) => void;
}) {
  const urgentCount = useMemo(() => jobs.filter(j => j.priority === "urgent" || j.priority === "high").length, [jobs]);
  const sortedJobs = useMemo(() => [...jobs].sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  }), [jobs]);

  return (
    <div className="flex flex-col w-[280px] flex-shrink-0 bg-red-50 rounded-lg border-2 border-red-200 overflow-hidden">
      <div className="p-3 bg-red-100 border-b border-red-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-bold text-red-800">Unassigned</span>
          </div>
          <Badge variant="destructive">{jobs.length}</Badge>
        </div>
        {urgentCount > 0 && (
          <div className="text-xs text-red-600">
            ⚠️ {urgentCount} high priority job{urgentCount > 1 ? "s" : ""} need attention
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {sortedJobs.map(job => (
            <DraggableJob key={job.id} jobId={job.id}>
              <DispatchBoardJob job={job} onSelect={() => onJobSelect(job)} isSelected={selectedJobId === job.id} />
            </DraggableJob>
          ))}
        {jobs.length === 0 && (
          <div className="text-center py-6 text-green-600 text-sm">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
            All jobs assigned!
          </div>
        )}
      </div>
    </div>
  );
});
