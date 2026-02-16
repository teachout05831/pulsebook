"use client";

import { Route, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MapGroup } from "./map-helpers";
import type { RouteResult } from "./route-types";

interface RouteControlsProps {
  groups: MapGroup[];
  activeRoutes: Map<string, RouteResult>;
  isCalculating: boolean;
  isPanelOpen: boolean;
  onTogglePanel: () => void;
}

export function RouteControls({
  groups,
  activeRoutes,
  isCalculating,
  isPanelOpen,
  onTogglePanel,
}: RouteControlsProps) {
  const hasRoutes = activeRoutes.size > 0;
  const routableGroups = groups.filter(
    (g) => g.key !== "__unassigned__" && g.jobs.length >= 2,
  );

  if (routableGroups.length === 0) return null;

  return (
    <div className="absolute top-3 left-3 z-[1060]">
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "h-8 gap-1.5 bg-white shadow-md",
          (hasRoutes || isPanelOpen) && "border-blue-500 text-blue-700",
        )}
        onClick={onTogglePanel}
      >
        {isCalculating ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Route className="h-3.5 w-3.5" />
        )}
        Routes
        {hasRoutes && (
          <span className="text-[10px] bg-blue-100 text-blue-700 px-1 rounded">
            {activeRoutes.size}
          </span>
        )}
      </Button>
    </div>
  );
}
