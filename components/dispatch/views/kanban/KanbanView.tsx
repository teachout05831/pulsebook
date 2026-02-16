"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "../../dispatch-provider";
import { DndProvider, DraggableJob, DroppableZone } from "../../dnd";
import { JobDetailDialog } from "../../job-details/JobDetailDialog";
import { DragEndEvent } from "@dnd-kit/core";
import { DispatchJob } from "@/types/dispatch";
import { cn } from "@/lib/utils";
import { KanbanCard } from "./KanbanCard";

type KanbanColumn = {
  id: DispatchJob["status"];
  title: string;
  color: string;
};

const COLUMNS: KanbanColumn[] = [
  { id: "unassigned", title: "Unassigned", color: "border-t-red-500" },
  { id: "scheduled", title: "Scheduled", color: "border-t-blue-500" },
  { id: "in_progress", title: "In Progress", color: "border-t-yellow-500" },
  { id: "completed", title: "Completed", color: "border-t-green-500" },
];

function KanbanColumnComponent({ column, jobs, onJobClick }: { column: KanbanColumn; jobs: DispatchJob[]; onJobClick: (job: DispatchJob) => void }) {
  return (
    <div className="flex flex-col min-w-[300px] max-w-[300px] bg-gray-100 rounded-lg">
      <div className={cn("p-3 border-t-4 rounded-t-lg", column.color)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{column.title}</span>
            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">{jobs.length}</span>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <DroppableZone id={column.id} className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-300px)] min-h-[100px] rounded-b-lg">
        {jobs.map(job => (
          <DraggableJob key={job.id} jobId={job.id}>
            <KanbanCard job={job} onClick={() => onJobClick(job)} />
          </DraggableJob>
        ))}
        {jobs.length === 0 && (
          <div className="text-center text-sm text-gray-400 py-8">No jobs</div>
        )}
      </DroppableZone>
    </div>
  );
}

export function KanbanView() {
  const { jobs, setSelectedJobId, setIsDetailsPanelOpen, optimisticUpdateJobStatus, updateJob } = useDispatch();
  const [dialogJob, setDialogJob] = useState<DispatchJob | null>(null);

  const jobsByStatus = useMemo(() => {
    const grouped = new Map<DispatchJob["status"], DispatchJob[]>();
    COLUMNS.forEach(col => grouped.set(col.id, []));
    jobs.forEach(job => {
      const current = grouped.get(job.status) || [];
      current.push(job);
      grouped.set(job.status, current);
    });
    return grouped;
  }, [jobs]);

  const lastClickRef = useRef<{ id: string; time: number }>({ id: "", time: 0 });

  const handleJobClick = useCallback((job: DispatchJob) => {
    const now = Date.now();
    if (lastClickRef.current.id === job.id && now - lastClickRef.current.time < 400) {
      setDialogJob(job);
      lastClickRef.current = { id: "", time: 0 };
      return;
    }
    lastClickRef.current = { id: job.id, time: now };
    setSelectedJobId(job.id);
    setIsDetailsPanelOpen(true);
  }, [setSelectedJobId, setIsDetailsPanelOpen]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const jobId = active.id as string;
    const newStatus = over.id as DispatchJob["status"];
    const job = jobs.find(j => j.id === jobId);
    if (!job || job.status === newStatus) return;
    optimisticUpdateJobStatus(jobId, newStatus);
    try {
      await updateJob(jobId, { status: newStatus });
    } catch (error) {
      console.error("Failed to update job status:", error);
    }
  };

  return (
    <>
      <DndProvider onDragEnd={handleDragEnd}>
        <div className="p-6 overflow-x-auto">
          <div className="flex gap-4">
            {COLUMNS.map(column => (
              <KanbanColumnComponent key={column.id} column={column} jobs={jobsByStatus.get(column.id) || []} onJobClick={handleJobClick} />
            ))}
          </div>
        </div>
      </DndProvider>
      <JobDetailDialog job={dialogJob} open={!!dialogJob} onOpenChange={(o) => { if (!o) setDialogJob(null); }} />
    </>
  );
}
