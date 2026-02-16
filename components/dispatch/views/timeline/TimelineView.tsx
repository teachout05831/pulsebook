"use client";

import { useMemo, useCallback, useRef, useState } from "react";
import { useDispatch } from "../../dispatch-provider";
import { useTimelineDnd } from "@/hooks/use-timeline-dnd";
import { DndProvider } from "../../dnd";
import { JobDetailDialog } from "../../job-details/JobDetailDialog";
import { TimelineHeader } from "./TimelineHeader";
import { TechnicianRow } from "./TechnicianRow";
import { UnassignedRow } from "./UnassignedRow";
import { BottomDrawer } from "./BottomDrawer";
import { DispatchJob } from "@/types/dispatch";

export function TimelineView() {
  const { jobs, technicians, crews, setSelectedJobId, setIsDetailsPanelOpen, showMap } = useDispatch();
  const { handleDragEnd } = useTimelineDnd();

  // Build crew lookup: crewDatabaseId → crew (with members who are technicians)
  const crewMap = useMemo(() => {
    const map = new Map<string, typeof crews[number]>();
    crews.forEach((c) => {
      map.set(c.databaseId, c);
      map.set(c.id, c);
    });
    return map;
  }, [crews]);

  const jobsByTechnician = useMemo(() => {
    const grouped = new Map<string, DispatchJob[]>();
    technicians.forEach((tech) => grouped.set(tech.id, []));
    grouped.set("unassigned", []);
    jobs.forEach((job) => {
      // 1. Job assigned to a specific technician
      if (job.assignedTechnicianId) {
        const current = grouped.get(job.assignedTechnicianId) || [];
        current.push(job);
        grouped.set(job.assignedTechnicianId, current);
        return;
      }
      // 2. Job assigned to a crew — place on lead member's row (or first member)
      if (job.assignedCrewId) {
        const crew = crewMap.get(job.assignedCrewId);
        if (crew && crew.members.length > 0) {
          const targetTechId = crew.leadMemberId
            ? crew.members.find((m) => m.databaseId === crew.leadMemberId)?.id ?? crew.members[0].id
            : crew.members[0].id;
          const current = grouped.get(targetTechId) || [];
          current.push(job);
          grouped.set(targetTechId, current);
          return;
        }
      }
      // 3. Truly unassigned
      const current = grouped.get("unassigned") || [];
      current.push(job);
      grouped.set("unassigned", current);
    });
    return grouped;
  }, [jobs, technicians, crewMap]);

  const [dialogJob, setDialogJob] = useState<DispatchJob | null>(null);
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

  return (
    <div className="flex flex-col h-full">
      {/* Timeline — wrapped in DndProvider for drag-drop */}
      <DndProvider onDragEnd={handleDragEnd}>
        <div className="flex flex-col flex-1 overflow-hidden bg-white">
          <div className="flex items-center border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="w-[200px] flex-shrink-0 border-r border-gray-200 p-2">
              <span className="text-sm font-medium text-gray-700">Technicians</span>
            </div>
            <TimelineHeader />
          </div>

          <div className="flex-1 overflow-x-auto overflow-y-auto">
            {technicians.map((tech) => (
              <TechnicianRow
                key={tech.id}
                technician={tech}
                jobs={jobsByTechnician.get(tech.id) || []}
                onJobClick={handleJobClick}
              />
            ))}
            <UnassignedRow
              jobs={jobsByTechnician.get("unassigned") || []}
              onJobClick={handleJobClick}
            />
          </div>
        </div>
      </DndProvider>

      {/* Bottom drawer with map — outside DnD context */}
      <BottomDrawer
        jobs={jobs}
        crews={crews}
        technicians={technicians}
        groupMode="technician"
        onJobClick={handleJobClick}
        isOpen={showMap}
      />
      <JobDetailDialog job={dialogJob} open={!!dialogJob} onOpenChange={(o) => { if (!o) setDialogJob(null); }} />
    </div>
  );
}
