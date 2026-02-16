"use client";

import { memo, useMemo } from "react";
import { Phone, MessageSquare, Navigation, PlayCircle, MoreHorizontal } from "lucide-react";
import { TechnicianAvatar } from "../../shared/technician-avatar";
import { DraggableJob } from "../../dnd";
import type { DispatchJob, DispatchTechnician } from "@/types/dispatch";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DispatchBoardJob } from "./DispatchBoardJob";
import { techStatusConfig } from "./board-helpers";

interface TechnicianColumnProps {
  technician: DispatchTechnician;
  jobs: DispatchJob[];
  selectedJobId: string | null;
  onJobSelect: (job: DispatchJob) => void;
}

export const TechnicianColumn = memo(function TechnicianColumn({ technician, jobs, selectedJobId, onJobSelect }: TechnicianColumnProps) {
  const techStatus = techStatusConfig[technician.status];
  const currentJob = useMemo(() => jobs.find(j => j.status === "in_progress"), [jobs]);
  const completedCount = useMemo(() => jobs.filter(j => j.status === "completed").length, [jobs]);

  return (
    <div className="flex flex-col w-[280px] flex-shrink-0 bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <TechnicianAvatar technician={technician} showStatus size="md" />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-gray-900 truncate">{technician.name}</div>
            <div className={cn("text-xs flex items-center gap-1", techStatus.color)}>
              <span className={cn("w-2 h-2 rounded-full", techStatus.indicator)} />
              {techStatus.label}
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="h-7 text-xs flex-1">
            <Phone className="w-3 h-3 mr-1" />Call
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs flex-1">
            <MessageSquare className="w-3 h-3 mr-1" />Message
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs flex-1">
            <Navigation className="w-3 h-3 mr-1" />Track
          </Button>
        </div>

        {currentJob && (
          <div className="mt-2 p-2 bg-yellow-100 rounded-md border border-yellow-200">
            <div className="flex items-center gap-2 text-xs">
              <PlayCircle className="w-3 h-3 text-yellow-600" />
              <span className="font-medium text-yellow-800 truncate">Active: {currentJob.title}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-around py-2 bg-gray-50 border-b border-gray-200 text-xs">
        <div className="text-center">
          <div className="font-semibold text-gray-900">{jobs.length}</div>
          <div className="text-gray-500">Assigned</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-green-600">{completedCount}</div>
          <div className="text-gray-500">Complete</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-gray-700">{jobs.length - completedCount}</div>
          <div className="text-gray-500">Remaining</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {jobs.map(job => (
          <DraggableJob key={job.id} jobId={job.id}>
            <DispatchBoardJob job={job} onSelect={() => onJobSelect(job)} isSelected={selectedJobId === job.id} technician={technician} />
          </DraggableJob>
        ))}
        {jobs.length === 0 && (
          <div className="text-center py-6 text-gray-400 text-sm">No jobs assigned</div>
        )}
      </div>
    </div>
  );
});
