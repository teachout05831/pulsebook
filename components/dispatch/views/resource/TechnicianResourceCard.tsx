"use client";

import { useState } from "react";
import { Wrench, ChevronDown, ChevronUp } from "lucide-react";
import { TechnicianAvatar } from "../../shared/technician-avatar";
import type { DispatchJob, DispatchTechnician } from "@/types/dispatch";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ResourceJobCard } from "./ResourceJobCard";

interface TechnicianResourceCardProps {
  technician: DispatchTechnician;
  jobs: DispatchJob[];
  onJobClick: (job: DispatchJob) => void;
}

export function TechnicianResourceCard({ technician, jobs, onJobClick }: TechnicianResourceCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const completedJobs = jobs.filter(j => j.status === "completed").length;
  const totalMinutes = jobs.reduce((sum, job) => sum + (job.estimatedDuration || 60), 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  const workDayMinutes = 8 * 60;
  const utilization = Math.min(100, Math.round((totalMinutes / workDayMinutes) * 100));

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-4 p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
      >
        <TechnicianAvatar technician={technician} showStatus size="md" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{technician.name}</h3>
            <Badge variant="outline" className="text-xs">{technician.role || "Technician"}</Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
            {technician.skills && technician.skills.length > 0 && (
              <span className="flex items-center gap-1">
                <Wrench className="w-3 h-3" />
                {technician.skills.slice(0, 2).join(", ")}
                {technician.skills.length > 2 && ` +${technician.skills.length - 2}`}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{jobs.length}</div>
            <div className="text-xs text-gray-500">Jobs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{completedJobs}</div>
            <div className="text-xs text-gray-500">Done</div>
          </div>
          <div className="text-center min-w-[80px]">
            <div className="text-sm font-semibold text-gray-700">{totalHours}h {remainingMinutes}m</div>
            <div className="text-xs text-gray-500">Scheduled</div>
          </div>
        </div>

        <div className="w-32">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Utilization</span>
            <span className={cn(
              "font-medium",
              utilization > 100 ? "text-red-600" : utilization > 80 ? "text-yellow-600" : "text-green-600"
            )}>{utilization}%</span>
          </div>
          <Progress
            value={utilization}
            className={cn(
              "h-2",
              utilization > 100 && "[&>div]:bg-red-500",
              utilization > 80 && utilization <= 100 && "[&>div]:bg-yellow-500"
            )}
          />
        </div>

        <div className="text-gray-400">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      {isExpanded && jobs.length > 0 && (
        <div className="p-4 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-2">
            {jobs.map(job => (
              <ResourceJobCard key={job.id} job={job} onClick={() => onJobClick(job)} />
            ))}
          </div>
        </div>
      )}

      {isExpanded && jobs.length === 0 && (
        <div className="p-6 text-center text-gray-500 border-t border-gray-100">
          <div className="text-sm">No jobs assigned for this period</div>
        </div>
      )}
    </div>
  );
}
