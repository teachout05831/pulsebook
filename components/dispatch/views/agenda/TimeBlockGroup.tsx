"use client";

import { Plus } from "lucide-react";
import type { DispatchJob } from "@/types/dispatch";
import { AgendaJobCard } from "./AgendaJobCard";

interface TimeBlockGroupProps {
  label: string;
  icon: string;
  jobs: DispatchJob[];
  onJobClick: (job: DispatchJob) => void;
  dateStr: string;
  timeBlockStart: number;
}

export function TimeBlockGroup({ label, icon, jobs, onJobClick, dateStr, timeBlockStart }: TimeBlockGroupProps) {
  const quickAddTime = `${timeBlockStart.toString().padStart(2, "0")}:00`;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <h3 className="font-semibold text-gray-700">{label}</h3>
          <span className="text-sm text-gray-400">({jobs.length} jobs)</span>
        </div>
        <a
          href={`/jobs/new?date=${dateStr}&time=${quickAddTime}`}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Job
        </a>
      </div>
      {jobs.length > 0 ? (
        <div className="space-y-2">
          {jobs.map(job => (
            <AgendaJobCard key={job.id} job={job} onClick={() => onJobClick(job)} />
          ))}
        </div>
      ) : (
        <div className="py-4 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center">
          <p className="text-sm text-gray-500">No jobs scheduled</p>
          <a
            href={`/jobs/new?date=${dateStr}&time=${quickAddTime}`}
            className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-3 h-3" />
            Schedule a job for {label.toLowerCase()}
          </a>
        </div>
      )}
    </div>
  );
}
