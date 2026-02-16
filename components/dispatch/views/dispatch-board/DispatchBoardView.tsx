"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { useDispatch } from "../../dispatch-provider";
import { DndProvider, DroppableZone } from "../../dnd";
import { JobDetailDialog } from "../../job-details/JobDetailDialog";
import { DispatchJob } from "@/types/dispatch";
import { TechnicianColumn } from "./TechnicianColumn";
import { UnassignedColumn } from "./UnassignedColumn";

export function DispatchBoardView() {
  const { jobs, technicians, optimisticAssignJob, updateJob } = useDispatch();
  const [localSelectedId, setLocalSelectedId] = useState<string | null>(null);
  const [dialogJob, setDialogJob] = useState<DispatchJob | null>(null);

  const jobsByTechnician = useMemo(() => {
    const groups = new Map<string, DispatchJob[]>();
    technicians.forEach(tech => groups.set(tech.id, []));
    jobs.forEach(job => {
      if (job.assignedTechnicianId) {
        const current = groups.get(job.assignedTechnicianId) || [];
        current.push(job);
        groups.set(job.assignedTechnicianId, current);
      }
    });
    return groups;
  }, [jobs, technicians]);

  const unassignedJobs = useMemo(
    () => jobs.filter(j => !j.assignedTechnicianId),
    [jobs]
  );

  const sortedTechnicians = useMemo(() => {
    return [...technicians].sort((a, b) => {
      const statusOrder = { busy: 0, available: 1, break: 2, offline: 3 };
      return statusOrder[a.status] - statusOrder[b.status];
    });
  }, [technicians]);

  const lastClickRef = useRef<{ id: string; time: number }>({ id: "", time: 0 });

  const handleJobSelect = useCallback((job: DispatchJob) => {
    const now = Date.now();
    if (lastClickRef.current.id === job.id && now - lastClickRef.current.time < 400) {
      setDialogJob(job);
      lastClickRef.current = { id: "", time: 0 };
      return;
    }
    lastClickRef.current = { id: job.id, time: now };
    setLocalSelectedId(job.id);
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const jobId = active.id as string;
    const targetId = over.id as string;
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    let techId: string | null = null;
    let techName: string | null = null;

    if (targetId === "unassigned") {
      techId = null;
      techName = null;
    } else if (targetId.startsWith("tech-")) {
      techId = targetId.replace("tech-", "");
      const tech = technicians.find(t => t.id === techId);
      techName = tech?.name ?? null;
    }

    if (job.assignedTechnicianId === techId) return;

    optimisticAssignJob(jobId, techId, techName);
    try {
      await updateJob(jobId, {
        assignedTechnicianId: techId,
        assignedTechnicianName: techName,
        status: techId ? "scheduled" : "unassigned",
      });
    } catch {
      // updateJob refetches on error, reverting optimistic update
    }
  };

  return (
    <>
      <DndProvider onDragEnd={handleDragEnd}>
        <div className="flex h-full bg-gray-100">
          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-4 p-4 min-h-full">
              <DroppableZone id="unassigned" className="h-full">
                <UnassignedColumn jobs={unassignedJobs} selectedJobId={localSelectedId} onJobSelect={handleJobSelect} />
              </DroppableZone>
              {sortedTechnicians.map(technician => (
                <DroppableZone key={technician.id} id={`tech-${technician.id}`} className="h-full">
                  <TechnicianColumn
                    technician={technician}
                    jobs={jobsByTechnician.get(technician.id) || []}
                    selectedJobId={localSelectedId}
                    onJobSelect={handleJobSelect}
                  />
                </DroppableZone>
              ))}
            </div>
          </div>
        </div>
      </DndProvider>
      <JobDetailDialog job={dialogJob} open={!!dialogJob} onOpenChange={(o) => { if (!o) setDialogJob(null); }} />
    </>
  );
}
