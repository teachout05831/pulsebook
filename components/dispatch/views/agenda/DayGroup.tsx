"use client";

import { useMemo } from "react";
import { Calendar } from "lucide-react";
import type { DispatchJob } from "@/types/dispatch";
import { TIME_BLOCKS, getTimeBlock, formatDate } from "./agenda-helpers";
import { TimeBlockGroup } from "./TimeBlockGroup";

interface DayGroupProps {
  date: string;
  jobs: DispatchJob[];
  onJobClick: (job: DispatchJob) => void;
}

export function DayGroup({ date, jobs, onJobClick }: DayGroupProps) {
  const jobsByTimeBlock = useMemo(() => {
    const groups: Record<string, DispatchJob[]> = {};
    TIME_BLOCKS.forEach(block => { groups[block.label] = []; });

    jobs.forEach(job => {
      const blockLabel = getTimeBlock(job.scheduledTime);
      groups[blockLabel].push(job);
    });

    Object.values(groups).forEach(blockJobs => {
      blockJobs.sort((a, b) => (a.scheduledTime || "00:00").localeCompare(b.scheduledTime || "00:00"));
    });

    return groups;
  }, [jobs]);

  const completedCount = jobs.filter(j => j.status === "completed").length;
  const inProgressCount = jobs.filter(j => j.status === "in_progress").length;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{formatDate(date)}</h2>
            <div className="text-sm text-gray-500">{jobs.length} jobs scheduled</div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-green-600">{completedCount} completed</span>
          <span className="text-yellow-600">{inProgressCount} in progress</span>
          <span className="text-gray-500">{jobs.length - completedCount - inProgressCount} remaining</span>
        </div>
      </div>
      {TIME_BLOCKS.map(block => (
        <TimeBlockGroup
          key={block.label}
          label={block.label}
          icon={block.icon}
          jobs={jobsByTimeBlock[block.label]}
          onJobClick={onJobClick}
          dateStr={date}
          timeBlockStart={block.start}
        />
      ))}
    </div>
  );
}
