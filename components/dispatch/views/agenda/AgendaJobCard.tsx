"use client";

import { useState } from "react";
import { MapPin, User, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDispatch } from "../../dispatch-provider";
import { TechnicianAvatar } from "../../shared/technician-avatar";
import { cn } from "@/lib/utils";
import type { DispatchJob } from "@/types/dispatch";
import { statusConfig, priorityConfig, formatTime } from "./agenda-helpers";

interface AgendaJobCardProps {
  job: DispatchJob;
  onClick: () => void;
}

export function AgendaJobCard({ job, onClick }: AgendaJobCardProps) {
  const { technicians } = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const technician = technicians.find(t => t.id === job.assignedTechnicianId);
  const status = statusConfig[job.status];
  const priority = priorityConfig[job.priority];

  return (
    <div
      className={cn(
        "group bg-white rounded-lg border border-gray-200 transition-all",
        isExpanded ? "shadow-md border-blue-300" : "hover:border-blue-300 hover:shadow-md"
      )}
    >
      <div onClick={onClick} className="flex items-center gap-4 p-4 cursor-pointer">
        <div className="flex-shrink-0 w-20 text-center">
          {job.scheduledTime ? (
            <>
              <div className="text-lg font-semibold text-gray-900">
                {formatTime(job.scheduledTime).split(" ")[0]}
              </div>
              <div className="text-xs text-gray-500">
                {formatTime(job.scheduledTime).split(" ")[1]}
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-400">No time</div>
          )}
          {job.estimatedDuration && (
            <div className="text-xs text-gray-400 mt-1">{job.estimatedDuration} min</div>
          )}
        </div>
        <div className="w-px h-16 bg-gray-200" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{job.title}</h3>
            {job.priority !== "normal" && (
              <span className={cn("text-xs font-medium", priority.color)}>• {priority.label}</span>
            )}
          </div>
          <div className="text-sm text-gray-600 mb-2">{job.customerName}</div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate max-w-[200px]">{job.address}</span>
            </span>
            {job.jobType && <span className="text-gray-400">{job.jobType}</span>}
          </div>
        </div>
        <div className="flex-shrink-0 w-40">
          {technician ? (
            <div className="flex items-center gap-2">
              <TechnicianAvatar technician={technician} size="sm" />
              <span className="text-sm text-gray-700 truncate">{technician.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-600">
              <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm">Unassigned</span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <Badge className={cn(status.bgColor, status.color, "border-0")}>{status.label}</Badge>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
          className="p-1 hover:bg-gray-100 rounded"
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
          )}
        </button>
      </div>
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-gray-100 bg-gray-50 rounded-b-lg">
          <div className="grid grid-cols-2 gap-4 pt-3">
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">Full Address</div>
              <div className="text-sm text-gray-900">{job.address}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">Schedule</div>
              <div className="text-sm text-gray-900">
                {job.scheduledDate} at {formatTime(job.scheduledTime)}
                {job.estimatedDuration && ` (${job.estimatedDuration} min)`}
              </div>
            </div>
            {job.jobType && (
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">Job Type</div>
                <div className="text-sm text-gray-900">{job.jobType}</div>
              </div>
            )}
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">Priority</div>
              <div className={cn("text-sm font-medium", priority.color)}>{priority.label}</div>
            </div>
          </div>
          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
            <Button size="sm" variant="outline" onClick={onClick}>View Details</Button>
            <Button size="sm" variant="outline">Edit Job</Button>
          </div>
        </div>
      )}
    </div>
  );
}
