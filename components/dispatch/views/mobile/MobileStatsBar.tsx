"use client";

import { useDispatch } from "../../dispatch-provider";
import { cn } from "@/lib/utils";
import type { DispatchJob } from "@/types/dispatch";

interface StatDot {
  key: string;
  label: string;
  color: string;
  field: keyof Pick<
    ReturnType<typeof useStats>,
    "total" | "unassigned" | "scheduled" | "inProgress" | "completed"
  >;
}

function useStats() {
  const { stats } = useDispatch();
  return stats;
}

const STAT_DOTS: { key: string; label: string; color: string; field: string }[] = [
  { key: "total", label: "Total", color: "bg-gray-400", field: "total" },
  { key: "unassigned", label: "Unassigned", color: "bg-red-500", field: "unassigned" },
  { key: "scheduled", label: "Scheduled", color: "bg-blue-500", field: "scheduled" },
  { key: "in_progress", label: "In Progress", color: "bg-yellow-500", field: "inProgress" },
  { key: "completed", label: "Done", color: "bg-green-500", field: "completed" },
];

export function MobileStatsBar() {
  const { stats, filters, updateFilter, viewAccess } = useDispatch();

  if (!viewAccess.companySettings.showStatsBar) return null;

  const handleFilterToggle = (status: string) => {
    if (status === "total") return;
    const current = filters.statuses;
    const statusKey = status as DispatchJob["status"];
    if (current.includes(statusKey)) {
      updateFilter("statuses", current.filter((s) => s !== statusKey));
    } else {
      updateFilter("statuses", [...current, statusKey]);
    }
  };

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 border-b border-gray-200 overflow-x-auto scrollbar-hide">
      {STAT_DOTS.map(({ key, label, color, field }) => {
        const value = stats[field as keyof typeof stats] ?? 0;
        const isActive = key !== "total" && filters.statuses.includes(key as DispatchJob["status"]);
        return (
          <button
            key={key}
            onClick={() => handleFilterToggle(key)}
            className={cn(
              "flex items-center gap-1.5 text-xs whitespace-nowrap",
              isActive && "opacity-100 font-semibold",
              key === "total" && "cursor-default"
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full", color)} />
            <span className="text-gray-500">{label}</span>
            <span className="font-semibold text-gray-900">{value}</span>
          </button>
        );
      })}
    </div>
  );
}
