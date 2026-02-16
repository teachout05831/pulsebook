"use client";

import { Button } from "@/components/ui/button";
import type { JobsFilterStatus } from "../../../types";

interface FilterOption {
  value: JobsFilterStatus;
  label: string;
  count: number;
}

interface JobsFilterBarProps {
  filter: JobsFilterStatus;
  counts: { all: number; scheduled: number; inProgress: number; completed: number };
  onFilterChange: (filter: JobsFilterStatus) => void;
}

export function JobsFilterBar({ filter, counts, onFilterChange }: JobsFilterBarProps) {
  const options: FilterOption[] = [
    { value: "all", label: "All", count: counts.all },
    { value: "scheduled", label: "Scheduled", count: counts.scheduled },
    { value: "in_progress", label: "In Progress", count: counts.inProgress },
    { value: "completed", label: "Completed", count: counts.completed },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      {options.map((opt) => (
        <Button
          key={opt.value}
          variant={filter === opt.value ? "default" : "outline"}
          size="sm"
          className="shrink-0"
          onClick={() => onFilterChange(opt.value)}
        >
          {opt.label} ({opt.count})
        </Button>
      ))}
    </div>
  );
}
