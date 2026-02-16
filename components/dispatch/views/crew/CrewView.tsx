"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { Users, Plus } from "lucide-react";
import { useDispatch } from "../../dispatch-provider";
import { useCrewDnd } from "@/hooks/use-crew-dnd";
import { DndProvider } from "../../dnd";
import { JobDetailDialog } from "../../job-details/JobDetailDialog";
import { DispatchJob } from "@/types/dispatch";
import { HOURS, CELL_WIDTH, formatHour } from "../timeline/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BottomDrawer } from "../timeline/BottomDrawer";
import { pillColors } from "./crew-helpers";
import { CrewRow } from "./CrewRow";
import { UnassignedCrewRow } from "./UnassignedCrewRow";
import { useCrewMembers } from "./useCrewMembers";

export function CrewView() {
  const {
    jobs, technicians, crews,
    setSelectedJobId, setIsDetailsPanelOpen,
    selectedDate, showMap,
  } = useDispatch();
  const { handleDragEnd } = useCrewDnd();
  const { localCrews, availableTechs, handleAddMember, handleRemoveMember } = useCrewMembers(crews, technicians, selectedDate);

  const jobsByCrew = useMemo(() => {
    const groups = new Map<string, DispatchJob[]>();
    localCrews.forEach(crew => {
      const memberTechIds = crew.members.map(m => m.id);
      const crewJobs = jobs.filter(j => {
        if (j.assignedCrewId) return j.assignedCrewId === crew.databaseId;
        return memberTechIds.includes(j.assignedTechnicianId || "");
      });
      groups.set(crew.id, crewJobs);
    });
    return groups;
  }, [jobs, localCrews]);

  const unassignedJobs = useMemo(
    () => jobs.filter(j => !j.assignedTechnicianId && !j.assignedCrewId),
    [jobs]
  );

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

  const [currentHour, setCurrentHour] = useState<number | null>(null);
  useEffect(() => { setCurrentHour(new Date().getHours()); }, []);

  return (
    <div className="flex flex-col h-full">
    <DndProvider onDragEnd={handleDragEnd} autoScroll={false}>
      <div className="flex flex-col flex-1 overflow-hidden bg-white">
        <div className="flex border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
          <div className="w-[202px] flex-shrink-0 border-r border-gray-200 px-3 py-1.5">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Crews</span>
          </div>
          <div className="flex" style={{ minWidth: HOURS.length * CELL_WIDTH }}>
            {HOURS.map(hour => (
              <div
                key={hour}
                style={{ width: CELL_WIDTH }}
                className={cn(
                  "text-center py-1.5 text-[10px] border-r border-gray-100",
                  currentHour === hour ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-400"
                )}
              >
                {formatHour(hour)}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <UnassignedCrewRow jobs={unassignedJobs} onJobClick={handleJobClick} />
          {localCrews.map(crew => (
            <CrewRow
              key={crew.id}
              crew={crew}
              jobs={jobsByCrew.get(crew.id) || []}
              availableTechs={availableTechs}
              onJobClick={handleJobClick}
              onAddMember={handleAddMember}
              onRemoveMember={handleRemoveMember}
            />
          ))}
          {localCrews.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <div className="text-lg font-medium mb-1">No crews configured</div>
              <div className="text-sm mb-4">Create crews in Settings to get started</div>
              <Button><Plus className="w-4 h-4 mr-2" />Create First Crew</Button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-1.5 border-t border-gray-200 bg-white text-[10px]">
          <div className="flex items-center gap-3">
            <span className="text-gray-400 font-medium">Status:</span>
            {Object.entries(pillColors).map(([status, colorClass]) => (
              <div key={status} className="flex items-center gap-1">
                <div className={cn("w-2 h-2 rounded-full border", colorClass)} />
                <span className="text-gray-500 capitalize">{status.replace("_", " ")}</span>
              </div>
            ))}
          </div>
          {localCrews.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-gray-400 font-medium">Crews:</span>
              {localCrews.map(c => (
                <div key={c.id} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-gray-500">{c.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DndProvider>

    <BottomDrawer
      jobs={jobs}
      crews={localCrews}
      technicians={technicians}
      groupMode="crew"
      onJobClick={handleJobClick}
      isOpen={showMap}
    />
    <JobDetailDialog job={dialogJob} open={!!dialogJob} onOpenChange={(o) => { if (!o) setDialogJob(null); }} />
    </div>
  );
}
