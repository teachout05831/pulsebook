"use client";

import { Clock, MapPin, User, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch } from "../../dispatch-provider";
import { TechnicianAvatar } from "../../shared/technician-avatar";
import { cn } from "@/lib/utils";
import type { DispatchJob } from "@/types/dispatch";

const statusStyles: Record<DispatchJob["status"], string> = {
  unassigned: "bg-red-100 text-red-800",
  scheduled: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
};

const statusLabels: Record<DispatchJob["status"], string> = {
  unassigned: "Unassigned",
  scheduled: "Scheduled",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

interface CardsJobCardProps {
  job: DispatchJob;
  onClick: () => void;
  onStatusChange: (status: DispatchJob["status"]) => void;
}

export function CardsJobCard({ job, onClick, onStatusChange }: CardsJobCardProps) {
  const { technicians } = useDispatch();
  const technician = technicians.find(t => t.id === job.assignedTechnicianId);

  return (
    <div className={cn("bg-white rounded-lg border shadow-sm overflow-hidden", "transition-all hover:shadow-md cursor-pointer")}>
      <div className={cn("h-1", {
        "bg-red-500": job.status === "unassigned",
        "bg-blue-500": job.status === "scheduled",
        "bg-yellow-500": job.status === "in_progress",
        "bg-green-500": job.status === "completed",
        "bg-gray-400": job.status === "cancelled",
      })} />
      <div className="p-4" onClick={onClick}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-900">{job.title}</h3>
            <p className="text-sm text-gray-500">{job.customerName}</p>
          </div>
          <div onClick={e => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onClick}>View Details</DropdownMenuItem>
                <DropdownMenuItem>Edit Job</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange("in_progress")}>Start Job</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange("completed")}>Complete Job</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{job.scheduledTime || "TBD"} • {job.estimatedDuration} min</span>
          </div>
          {job.address && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{job.address}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            {technician ? (
              <div className="flex items-center gap-2">
                <TechnicianAvatar technician={technician} size="sm" />
                <span className="text-gray-600">{technician.name}</span>
              </div>
            ) : (
              <span className="text-gray-400">Unassigned</span>
            )}
          </div>
        </div>
        <div className="mt-3 pt-3 border-t flex items-center justify-between">
          <span className={cn("text-xs px-2 py-1 rounded-full font-medium", statusStyles[job.status])}>
            {statusLabels[job.status]}
          </span>
          {job.priority === "urgent" && (
            <span className="text-xs text-red-600 font-medium">URGENT</span>
          )}
        </div>
      </div>
    </div>
  );
}
