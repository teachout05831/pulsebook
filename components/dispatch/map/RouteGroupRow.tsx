"use client";

import { useState } from "react";
import { ExternalLink, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { RouteLegRow } from "./RouteLegRow";
import { formatTotal, formatMiles, buildGoogleMapsUrl } from "./route-helpers";
import type { RouteResult } from "./route-types";
import type { MapGroup } from "./map-helpers";

interface RouteGroupRowProps {
  group: MapGroup;
  route: RouteResult | undefined;
  isCalculating: boolean;
  onToggle: () => void;
}

export function RouteGroupRow({ group, route, isCalculating, onToggle }: RouteGroupRowProps) {
  const [expanded, setExpanded] = useState(false);
  const isActive = !!route;

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-gray-50 transition-colors"
        disabled={isCalculating}
      >
        <div
          className="w-3 h-3 rounded-full flex-shrink-0 border-2"
          style={{ backgroundColor: isActive ? group.color : "transparent", borderColor: group.color }}
        />
        <span className="flex-1 text-left text-xs font-medium text-gray-800 truncate">{group.label}</span>
        <span className="text-[10px] text-gray-400">{group.jobs.length} stops</span>
        {isActive && route && (
          <span className="text-[10px] font-semibold text-gray-600">{formatTotal(route.totalDuration)}</span>
        )}
      </button>
      {isActive && route && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center gap-1 px-3.5 py-1 text-[10px] text-blue-600 hover:bg-blue-50/50"
          >
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {expanded ? "Hide details" : "Show details"} — {formatTotal(route.totalDuration)} · {formatMiles(route.totalDistance)}
          </button>
          {expanded && (
            <div className="bg-gray-50/50">
              <div className="flex items-center gap-2 px-3.5 py-1.5 border-t border-gray-100">
                <label className="flex items-center gap-1.5 flex-1 text-[10px] text-gray-400 cursor-not-allowed">
                  <div className="w-7 h-4 rounded-full bg-gray-200 relative">
                    <div className="absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow-sm" />
                  </div>
                  Start address
                </label>
                <button className="flex items-center gap-1 px-2 py-0.5 rounded border border-gray-200 bg-white text-[10px] text-gray-400 cursor-not-allowed" disabled>
                  <Zap className="h-2.5 w-2.5" />
                  Optimize
                </button>
              </div>
              {route.legs.map((leg, i) => (
                <RouteLegRow key={`${leg.from}-${leg.to}`} index={i} from={leg.from} to={leg.to} duration={leg.duration} distance={leg.distance} color={group.color} />
              ))}
              <div className="px-3.5 py-1.5 border-t border-gray-100">
                <a
                  href={buildGoogleMapsUrl(route.legs)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full py-1 rounded border border-gray-200 bg-white text-[10px] font-medium text-gray-500 hover:bg-gray-50"
                >
                  <ExternalLink className="h-3 w-3" />
                  Open in Google Maps
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
