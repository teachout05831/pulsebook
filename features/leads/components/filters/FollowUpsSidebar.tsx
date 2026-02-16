"use client";

import { cn } from "@/lib/utils";
import {
  FOLLOWUPS_SIDEBAR_FILTERS,
  type FollowUpsSidebarFilter,
} from "../../types";

interface FollowUpsSidebarProps {
  activeFilter: FollowUpsSidebarFilter;
  onFilterChange: (filter: FollowUpsSidebarFilter) => void;
  counts?: Record<FollowUpsSidebarFilter, number>;
}

export function FollowUpsSidebar({
  activeFilter,
  onFilterChange,
  counts,
}: FollowUpsSidebarProps) {
  return (
    <div className="hidden md:block w-44 bg-white border-r shrink-0">
      <div className="py-2">
        {FOLLOWUPS_SIDEBAR_FILTERS.map((filter) => {
          const isActive = activeFilter === filter.id;
          const count = counts?.[filter.id as FollowUpsSidebarFilter];

          return (
            <button
              key={filter.id}
              onClick={() =>
                onFilterChange(filter.id as FollowUpsSidebarFilter)
              }
              className={cn(
                "w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-slate-50",
                isActive
                  ? "bg-blue-50 border-l-2 border-blue-600 text-blue-600 font-medium"
                  : filter.color || "text-slate-600"
              )}
            >
              <span className="flex items-center justify-between">
                {filter.label}
                {count !== undefined && count > 0 && (
                  <span
                    className={cn(
                      "text-xs px-1.5 py-0.5 rounded",
                      isActive ? "bg-blue-100" : "bg-slate-100"
                    )}
                  >
                    {count}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
