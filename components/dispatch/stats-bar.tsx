"use client";

import { useDispatch } from "./dispatch-provider";
import { cn } from "@/lib/utils";
import type { DispatchJob } from "@/types/dispatch";

interface StatItemProps {
  label: string;
  value: number;
  color: string;
  onClick?: () => void;
}

function StatItem({ label, value, color, onClick }: StatItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 whitespace-nowrap px-2 py-1 rounded-md transition-colors",
        onClick && "hover:bg-gray-100 cursor-pointer"
      )}
    >
      <span className={cn("w-2 h-2 rounded-full", color)} />
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </button>
  );
}

export function StatsBar() {
  const { stats, viewAccess, updateFilter, filters } = useDispatch();

  // Only show if company settings allow
  if (!viewAccess.companySettings.showStatsBar) {
    return null;
  }

  const handleFilterByStatus = (status: DispatchJob["status"]) => {
    const currentStatuses = filters.statuses;
    if (currentStatuses.includes(status)) {
      updateFilter("statuses", currentStatuses.filter((s) => s !== status));
    } else {
      updateFilter("statuses", [...currentStatuses, status]);
    }
  };

  return (
    <div className="flex items-center gap-6 px-6 py-3 bg-gray-50 border-b border-gray-200 overflow-x-auto">
      <StatItem
        label="Total"
        value={stats.total}
        color="bg-gray-400"
      />
      <StatItem
        label="Unassigned"
        value={stats.unassigned}
        color="bg-red-500"
        onClick={() => handleFilterByStatus("unassigned")}
      />
      <StatItem
        label="Scheduled"
        value={stats.scheduled}
        color="bg-blue-500"
        onClick={() => handleFilterByStatus("scheduled")}
      />
      <StatItem
        label="In Progress"
        value={stats.inProgress}
        color="bg-yellow-500"
        onClick={() => handleFilterByStatus("in_progress")}
      />
      <StatItem
        label="Completed"
        value={stats.completed}
        color="bg-green-500"
        onClick={() => handleFilterByStatus("completed")}
      />
      {stats.cancelled > 0 && (
        <StatItem
          label="Cancelled"
          value={stats.cancelled}
          color="bg-gray-400"
          onClick={() => handleFilterByStatus("cancelled")}
        />
      )}
    </div>
  );
}
