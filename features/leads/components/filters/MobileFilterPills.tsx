"use client";

import { cn } from "@/lib/utils";
import type { SidebarFilterConfig } from "../../types";

interface MobileFilterPillsProps {
  filters: SidebarFilterConfig[];
  activeFilter: string;
  onFilterChange: (id: string) => void;
}

export function MobileFilterPills({
  filters,
  activeFilter,
  onFilterChange,
}: MobileFilterPillsProps) {
  return (
    <div className="md:hidden flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
      {filters.map((filter) => {
        const isActive = !filter.comingSoon && activeFilter === filter.id;
        return (
          <button
            key={filter.id}
            onClick={() => !filter.comingSoon && onFilterChange(filter.id)}
            disabled={filter.comingSoon}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
              filter.comingSoon
                ? "border-slate-200 text-slate-400 cursor-not-allowed"
                : isActive
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
            )}
          >
            {filter.label}
            {filter.comingSoon && (
              <span className="ml-1 text-[10px]">Soon</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
