"use client";

import { Navigation } from "lucide-react";
import { DispatchJob } from "@/types/dispatch";
import { cn } from "@/lib/utils";

interface MobileJobCardProps {
  job: DispatchJob;
  onViewDetails: (job: DispatchJob) => void;
}

const statusBarColor: Record<DispatchJob["status"], string> = {
  unassigned: "bg-red-500",
  scheduled: "bg-blue-500",
  in_progress: "bg-yellow-500",
  completed: "bg-green-500",
  cancelled: "bg-gray-400",
};

const statusBadgeStyle: Record<DispatchJob["status"], string> = {
  unassigned: "bg-red-50 text-red-700",
  scheduled: "bg-blue-50 text-blue-700",
  in_progress: "bg-yellow-50 text-yellow-700",
  completed: "bg-green-50 text-green-700",
  cancelled: "bg-gray-50 text-gray-500",
};


function formatTime(time: string | null): string {
  if (!time) return "TBD";
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export function MobileJobCard({ job, onViewDetails }: MobileJobCardProps) {
  const mapsUrl = job.address
    ? `https://maps.google.com/?q=${encodeURIComponent(job.address)}`
    : null;

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-3",
        "active:shadow-md transition-shadow",
        job.status === "completed" && "opacity-50"
      )}
      onClick={() => onViewDetails(job)}
    >
      <div className={cn("h-1", statusBarColor[job.status])} />
      <div className="p-3">
        <div className="flex items-start justify-between mb-1">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              {(job.priority === "urgent" || job.status === "unassigned") && (
                <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium", statusBadgeStyle[job.status])}>
                  {job.status === "unassigned" ? "UNASSIGNED" : "URGENT"}
                </span>
              )}
              <span className="text-xs text-gray-400">{formatTime(job.scheduledTime)}</span>
            </div>
            <div className="font-semibold text-sm text-gray-900">{job.title}</div>
            <div className="text-xs text-gray-500">{job.customerName}</div>
          </div>
        </div>
        {job.address && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1.5">
            <Navigation className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{job.address}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          {job.assignedTechnicianName ? (
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-medium">
                {job.assignedTechnicianName.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <span className="text-xs text-gray-500">{job.assignedTechnicianName.split(" ")[0]}</span>
            </div>
          ) : (
            <span className="text-xs text-red-600 font-medium">Unassigned</span>
          )}
          <span className="text-xs text-gray-400">~{Math.round(job.estimatedDuration / 60 * 10) / 10} hrs</span>
        </div>
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {job.customerPhone && (
            <a href={`tel:${job.customerPhone}`} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
              Call
            </a>
          )}
          {mapsUrl && (
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
              Navigate
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
