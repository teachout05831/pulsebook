"use client";

import { useCallback, useState } from "react";
import { LogOut, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDispatch } from "@/components/dispatch/dispatch-provider";
import type { DispatchJob } from "@/types/dispatch";
import type { MapGroupMode } from "./map-helpers";

interface Props {
  job: DispatchJob;
  groupMode: MapGroupMode;
  onMoved: (message: string) => void;
}

export function MapJobMovePopover({ job, groupMode, onMoved }: Props) {
  const [open, setOpen] = useState(false);
  const { crews, technicians, updateJob, optimisticAssignJob, optimisticAssignCrew } = useDispatch();

  const handleMove = useCallback(
    async (type: "crew" | "tech" | "unassign", id?: string, dbId?: string, name?: string) => {
      setOpen(false);
      try {
        if (type === "unassign") {
          optimisticAssignJob(job.id, null, null);
          optimisticAssignCrew(job.id, null, null);
          await updateJob(job.id, { assignedTo: null, assignedCrewId: null, status: "unassigned" } as Partial<DispatchJob>);
          onMoved("Job unassigned");
        } else if (type === "crew") {
          optimisticAssignCrew(job.id, dbId!, name!);
          await updateJob(job.id, { assignedCrewId: dbId!, status: "scheduled" } as Partial<DispatchJob>);
          onMoved(`Moved to ${name}`);
        } else {
          optimisticAssignJob(job.id, id!, name!);
          await updateJob(job.id, { assignedTo: dbId!, status: "scheduled" } as Partial<DispatchJob>);
          onMoved(`Moved to ${name}`);
        }
      } catch { /* refetch reverts optimistic update */ }
    },
    [job.id, updateJob, optimisticAssignJob, optimisticAssignCrew, onMoved],
  );

  const targets = groupMode === "crew"
    ? crews.map((c) => ({ id: c.id, dbId: c.databaseId, name: c.name, color: c.color, type: "crew" as const, isCurrent: c.databaseId === job.assignedCrewId }))
    : technicians.map((t) => ({ id: t.id, dbId: t.databaseId, name: t.name, color: t.color, type: "tech" as const, isCurrent: t.id === job.assignedTechnicianId || t.databaseId === job.assignedTechnicianId }));

  const isUnassigned = groupMode === "crew" ? !job.assignedCrewId : !job.assignedTechnicianId;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="w-[22px] h-[22px] rounded border border-transparent text-gray-300 hover:border-gray-200 hover:text-blue-500 hover:bg-blue-50 flex items-center justify-center flex-shrink-0 transition-colors"
          title="Move to..."
        >
          <LogOut className="w-3 h-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        align="start"
        sideOffset={8}
        className="w-[170px] p-1"
        style={{ zIndex: 9999 }}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide px-2 py-1">Move to</div>
        {targets.map((t) => (
          <button
            key={t.dbId}
            onClick={() => !t.isCurrent && handleMove(t.type, t.id, t.dbId, t.name)}
            disabled={t.isCurrent}
            className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-xs transition-colors ${t.isCurrent ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-100"}`}
          >
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: t.color }} />
            <span className="truncate">{t.name}</span>
            {t.isCurrent && <Check className="w-3 h-3 ml-auto text-blue-600" />}
          </button>
        ))}
        <div className="h-px bg-gray-100 my-1" />
        <button
          onClick={() => handleMove("unassign")}
          disabled={isUnassigned}
          className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-xs transition-colors ${isUnassigned ? "bg-gray-50 text-gray-400" : "text-gray-500 hover:bg-gray-100"}`}
        >
          <div className="w-2 h-2 rounded-sm flex-shrink-0 bg-gray-400" />
          Unassign
        </button>
      </PopoverContent>
    </Popover>
  );
}
