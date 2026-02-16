"use client";

import { useDispatch } from "../../dispatch-provider";
import { TechnicianAvatar } from "../../shared/technician-avatar";
import type { DispatchJob } from "@/types/dispatch";
import { cn } from "@/lib/utils";

interface KanbanCardProps {
  job: DispatchJob;
  onClick: () => void;
}

export function KanbanCard({ job, onClick }: KanbanCardProps) {
  const { technicians } = useDispatch();
  const technician = technicians.find(t => t.id === job.assignedTechnicianId);

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-lg border shadow-sm p-3 cursor-pointer",
        "transition-all hover:shadow-md hover:-translate-y-0.5"
      )}
    >
      <div className="font-medium text-sm mb-1">{job.title}</div>
      <div className="text-xs text-gray-500 mb-2">{job.customerName}</div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {job.scheduledTime || "TBD"} • {job.estimatedDuration}min
        </span>
        {technician && (
          <TechnicianAvatar technician={technician} size="sm" />
        )}
      </div>
    </div>
  );
}
