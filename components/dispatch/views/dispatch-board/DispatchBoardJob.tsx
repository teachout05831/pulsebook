"use client";

import { memo } from "react";
import { Clock, MapPin } from "lucide-react";
import { TechnicianAvatar } from "../../shared/technician-avatar";
import type { DispatchJob, DispatchTechnician } from "@/types/dispatch";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { statusConfig } from "./board-helpers";

interface DispatchBoardJobProps {
  job: DispatchJob;
  onSelect: () => void;
  isSelected: boolean;
  technician?: DispatchTechnician;
}

export const DispatchBoardJob = memo(function DispatchBoardJob({ job, onSelect, isSelected, technician }: DispatchBoardJobProps) {
  const status = statusConfig[job.status];

  return (
    <div
      onClick={onSelect}
      className={cn(
        "p-3 rounded-lg border-2 cursor-pointer transition-all",
        isSelected ? "border-blue-500 shadow-lg" : "border-gray-200 hover:border-gray-300",
        status.bgColor
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className={status.color}>{status.icon}</span>
          <span className="font-semibold text-sm text-gray-900">{job.title}</span>
        </div>
        {job.priority === "urgent" && (
          <Badge variant="destructive" className="text-[10px]">URGENT</Badge>
        )}
        {job.priority === "high" && (
          <Badge className="bg-orange-500 text-[10px]">HIGH</Badge>
        )}
      </div>

      <div className="text-xs text-gray-600 mb-2">{job.customerName}</div>

      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
        <MapPin className="w-3 h-3" />
        <span className="truncate">{job.address}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <Clock className="w-3 h-3 text-gray-400" />
          <span className="text-gray-600">{job.scheduledTime || "TBD"}</span>
          {job.estimatedDuration && (
            <span className="text-gray-400">• {job.estimatedDuration}min</span>
          )}
        </div>
        {technician && (
          <div className="flex items-center gap-1">
            <TechnicianAvatar technician={technician} size="xs" />
          </div>
        )}
      </div>
    </div>
  );
});
