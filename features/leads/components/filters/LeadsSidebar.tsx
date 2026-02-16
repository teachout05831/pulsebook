"use client";

import { cn } from "@/lib/utils";
import { LEADS_SIDEBAR_FILTERS, type LeadsSidebarFilter } from "../../types";

interface LeadsSidebarProps {
  activeFilter: LeadsSidebarFilter;
  onFilterChange: (filter: LeadsSidebarFilter) => void;
  counts?: Record<LeadsSidebarFilter, number>;
}

export function LeadsSidebar({
  activeFilter,
  onFilterChange,
  counts,
}: LeadsSidebarProps) {
  return (
    <div className="hidden md:block w-48 bg-white border-r shrink-0">
      <div className="py-2">
        {LEADS_SIDEBAR_FILTERS.map((filter) => {
          const isActive = !filter.comingSoon && activeFilter === filter.id;
          const count = counts?.[filter.id as LeadsSidebarFilter];

          return (
            <button
              key={filter.id}
              onClick={() =>
                !filter.comingSoon &&
                onFilterChange(filter.id as LeadsSidebarFilter)
              }
              disabled={filter.comingSoon}
              className={cn(
                "w-full text-left px-4 py-2.5 text-sm transition-colors",
                filter.comingSoon
                  ? "text-slate-400 cursor-not-allowed"
                  : "hover:bg-slate-50",
                isActive
                  ? "bg-blue-50 border-l-2 border-blue-600 text-blue-600 font-medium"
                  : !filter.comingSoon && (filter.color || "text-slate-600")
              )}
            >
              <span className="flex items-center justify-between">
                {filter.label}
                {filter.comingSoon ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-400">
                    Soon
                  </span>
                ) : (
                  count !== undefined &&
                  count > 0 && (
                    <span
                      className={cn(
                        "text-xs px-1.5 py-0.5 rounded",
                        isActive ? "bg-blue-100" : "bg-slate-100"
                      )}
                    >
                      {count}
                    </span>
                  )
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
