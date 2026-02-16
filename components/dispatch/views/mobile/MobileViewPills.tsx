"use client";

import {
  LayoutGrid,
  List,
  Columns3,
  Clock,
  Map as MapIcon,
} from "lucide-react";
import { useDispatch } from "../../dispatch-provider";
import { cn } from "@/lib/utils";
import type { DispatchView } from "@/types/dispatch";

interface MobilePill {
  id: DispatchView | "map";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MOBILE_PILLS: MobilePill[] = [
  { id: "cards", label: "Cards", icon: LayoutGrid },
  { id: "list", label: "List", icon: List },
  { id: "kanban", label: "Kanban", icon: Columns3 },
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "map", label: "Map", icon: MapIcon },
];

export function MobileViewPills() {
  const { currentView, setCurrentView, viewAccess, showMap, setShowMap } =
    useDispatch();

  const handlePillClick = (pill: MobilePill) => {
    if (pill.id === "map") {
      setShowMap(!showMap);
    } else {
      if (showMap) setShowMap(false);
      setCurrentView(pill.id as DispatchView);
    }
  };

  const isActive = (pill: MobilePill) => {
    if (pill.id === "map") return showMap;
    return !showMap && currentView === pill.id;
  };

  return (
    <div className="bg-white px-3 pb-2.5 border-b border-gray-200">
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-1 px-1">
        {MOBILE_PILLS.map((pill) => {
          if (pill.id !== "map" && !viewAccess.canAccess(pill.id as DispatchView)) {
            return null;
          }
          const Icon = pill.icon;
          const active = isActive(pill);
          return (
            <button
              key={pill.id}
              onClick={() => handlePillClick(pill)}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                active
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {pill.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
