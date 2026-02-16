"use client";

import { useCallback } from "react";
import { Plus, RefreshCw, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "./dispatch-provider";
import { DateNavigator } from "./date-navigator";
import { ViewSwitcher } from "./view-switcher";
import { TechnicianFilter } from "./technician-filter";
import { CrewFilter } from "./crew-filter";
import { DispatchButton } from "./DispatchButton";
import { cn } from "@/lib/utils";
import Link from "next/link";

const STATUS_DOTS = [
  { key: "unassigned", color: "bg-red-500", field: "unassigned" },
  { key: "scheduled", color: "bg-blue-500", field: "scheduled" },
  { key: "in_progress", color: "bg-yellow-500", field: "inProgress" },
  { key: "completed", color: "bg-green-500", field: "completed" },
] as const;

export function DispatchHeader() {
  const {
    refetch, isLoading, selectedDate, crews, technicians,
    dispatchStatus, stats, filters, updateFilter, viewAccess,
    showMap, setShowMap, currentView,
  } = useDispatch();

  const dateStr = selectedDate.toISOString().split("T")[0];
  const memberCount = technicians.filter(t => t.isActive).length;

  const handleDispatch = useCallback(async () => {
    const res = await fetch("/api/dispatch/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: dateStr }),
    });
    if (!res.ok) throw new Error("Failed to dispatch");
    await refetch();
  }, [dateStr, refetch]);

  const handleFilterByStatus = (status: string) => {
    const current = filters.statuses;
    if (current.includes(status as never)) {
      updateFilter("statuses", current.filter((s) => s !== status) as never);
    } else {
      updateFilter("statuses", [...current, status] as never);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center gap-3 px-4 py-2">
        {/* Title */}
        <h1 className="text-base font-bold text-gray-900 whitespace-nowrap">Dispatch</h1>
        <div className="w-px h-6 bg-gray-200 flex-shrink-0" />

        {/* Date nav */}
        <DateNavigator />
        <div className="w-px h-6 bg-gray-200 flex-shrink-0" />

        {/* Inline stat dots */}
        {viewAccess.companySettings.showStatsBar && (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {STATUS_DOTS.map(({ key, color, field }) => {
              const value = stats[field as keyof typeof stats] ?? 0;
              const isActive = filters.statuses.includes(key as never);
              return (
                <button
                  key={key}
                  onClick={() => handleFilterByStatus(key)}
                  className={cn(
                    "flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded transition-colors",
                    isActive ? "bg-gray-100 ring-1 ring-gray-300" : "hover:bg-gray-50"
                  )}
                  title={key.replace("_", " ")}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full", color)} />
                  <span className="text-gray-700">{value}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Right side — pushes to end */}
        <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
          <ViewSwitcher />
          <TechnicianFilter />
          <CrewFilter />
          {(currentView === "timeline" || currentView === "crew") && (
            <Button
              variant="outline"
              size="icon"
              className={cn("h-8 w-8", showMap && "border-blue-500 bg-blue-50 text-blue-700")}
              onClick={() => setShowMap(!showMap)}
              title={showMap ? "Hide map" : "Show map"}
            >
              <MapIcon className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => refetch()}
            disabled={isLoading}
            title="Refresh"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
          <DispatchButton
            date={dateStr}
            status={dispatchStatus}
            crewCount={crews.length}
            memberCount={memberCount}
            onDispatch={handleDispatch}
          />
          <Link href="/jobs/new">
            <Button size="sm" className="h-8 gap-1 text-xs">
              <Plus className="h-3.5 w-3.5" />
              Job
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
