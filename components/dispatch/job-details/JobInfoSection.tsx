"use client";

import { useState } from "react";
import { DispatchJob } from "@/types/dispatch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MapPin, Calendar, Phone } from "lucide-react";
import { useDispatch } from "../dispatch-provider";
import { InlineTimeEdit } from "./InlineTimeEdit";
import { InlineDurationEdit } from "./InlineDurationEdit";
import { InlineNotesEdit } from "./InlineNotesEdit";

interface JobInfoSectionProps {
  job: DispatchJob;
}

const priorityStyles: Record<DispatchJob["priority"], string> = {
  low: "bg-gray-100 text-gray-700",
  normal: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

const PRIORITY_CYCLE: DispatchJob["priority"][] = ["normal", "high", "urgent"];

export function JobInfoSection({ job }: JobInfoSectionProps) {
  const { updateJob } = useDispatch();
  const [flash, setFlash] = useState(false);

  const cyclePriority = async () => {
    const idx = PRIORITY_CYCLE.indexOf(job.priority);
    const next = PRIORITY_CYCLE[(idx + 1) % PRIORITY_CYCLE.length];
    setFlash(true);
    setTimeout(() => setFlash(false), 800);
    try {
      await updateJob(job.id, { priority: next } as Record<string, unknown>);
    } catch { /* reverts on refetch */ }
  };

  return (
    <div className="space-y-3">
      {/* Customer + Priority */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-semibold text-gray-900">{job.customerName}</div>
          {job.customerPhone && (
            <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{job.customerPhone}</span>
            </div>
          )}
        </div>
        <span
          className={cn(
            "text-[10px] font-medium px-2.5 py-0.5 rounded-full capitalize cursor-pointer transition-all hover:scale-105 active:scale-95",
            priorityStyles[job.priority],
            flash && "animate-save-flash"
          )}
          onClick={cyclePriority}
          title="Click to change priority"
        >
          {job.priority}
        </span>
      </div>

      {/* Info Rows */}
      <div className="space-y-1.5">
        <div className="flex items-start gap-2 text-xs text-gray-600 py-0.5">
          <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-gray-400" />
          <span className="leading-relaxed">{job.address}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-600 py-0.5 rounded hover:bg-gray-100 cursor-pointer px-0.5 -mx-0.5 group" onClick={() => {}}>
          <Calendar className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
          <span>{job.scheduledDate}</span>
        </div>

        <InlineTimeEdit job={job} />
        <InlineDurationEdit job={job} />
        <InlineNotesEdit job={job} />
      </div>
    </div>
  );
}
