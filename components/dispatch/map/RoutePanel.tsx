"use client";

import { X, Navigation } from "lucide-react";
import { RouteGroupRow } from "./RouteGroupRow";
import type { RouteResult } from "./route-types";
import type { MapGroup } from "./map-helpers";

interface RoutePanelProps {
  groups: MapGroup[];
  routes: Map<string, RouteResult>;
  isCalculating: boolean;
  onToggleRoute: (groupKey: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export function RoutePanel({ groups, routes, isCalculating, onToggleRoute, onClearAll, onClose }: RoutePanelProps) {
  const routableGroups = groups.filter(
    (g) => g.key !== "__unassigned__" && g.jobs.length >= 2,
  );

  if (routableGroups.length === 0) return null;

  const hasRoutes = routes.size > 0;

  return (
    <div className="absolute top-12 left-3 z-[1055] w-[300px] bg-white rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.15)] border border-gray-200 flex flex-col overflow-hidden max-h-[calc(100%-60px)]">
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-gray-200">
        <div className="flex items-center gap-1.5">
          <Navigation className="h-3.5 w-3.5 text-blue-600" />
          <span className="text-xs font-semibold text-gray-900">Routes</span>
          {hasRoutes && (
            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 rounded-full font-semibold">
              {routes.size}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="overflow-y-auto flex-1">
        <div className="px-3.5 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
          Click to toggle route
        </div>
        {routableGroups.map((group) => (
          <RouteGroupRow
            key={group.key}
            group={group}
            route={routes.get(group.key)}
            isCalculating={isCalculating}
            onToggle={() => onToggleRoute(group.key)}
          />
        ))}
      </div>
      {hasRoutes && (
        <div className="border-t border-gray-200 px-3.5 py-2">
          <button
            onClick={onClearAll}
            className="w-full text-center text-[11px] font-medium text-red-500 hover:text-red-600 py-1"
          >
            Clear all routes
          </button>
        </div>
      )}
    </div>
  );
}
