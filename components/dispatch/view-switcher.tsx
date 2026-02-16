"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  List,
  Columns3,
  LayoutGrid,
  CalendarDays,
  Calendar,
  Grid3X3,
  Truck,
  Users,
  ChevronDown,
  Check,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch } from "./dispatch-provider";
import { DispatchView, DISPATCH_VIEWS, getViewInfo } from "@/types/dispatch";
import { cn } from "@/lib/utils";

// Map view IDs to Lucide icons
const viewIcons: Record<DispatchView, React.ElementType> = {
  timeline: LayoutDashboard,
  list: List,
  kanban: Columns3,
  cards: LayoutGrid,
  agenda: CalendarDays,
  week: Calendar,
  resource: Grid3X3,
  dispatch: Truck,
  crew: Users,
};

// Group views by tier for display
const viewGroups = [
  {
    label: "Basic Views",
    views: ["timeline", "list", "kanban", "cards"] as DispatchView[],
  },
  {
    label: "Professional Views",
    views: ["agenda", "week", "resource"] as DispatchView[],
  },
  {
    label: "Enterprise Views",
    views: ["dispatch", "crew"] as DispatchView[],
  },
];

export function ViewSwitcher() {
  const { currentView, setCurrentView, viewAccess } = useDispatch();
  const [open, setOpen] = useState(false);

  const currentViewInfo = getViewInfo(currentView);
  const CurrentIcon = viewIcons[currentView];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">View:</span>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="min-w-[200px] justify-between">
            <span className="flex items-center gap-2">
              <CurrentIcon className="h-4 w-4" />
              {currentViewInfo?.label || "Select View"}
            </span>
            <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[280px] z-[9999]">
          {viewGroups.map((group, groupIndex) => {
            // Only show groups that have at least one accessible view
            const accessibleInGroup = group.views.filter((v) => viewAccess.canAccess(v));
            const lockedInGroup = group.views.filter((v) => !viewAccess.canAccess(v));

            if (accessibleInGroup.length === 0 && lockedInGroup.length === 0) {
              return null;
            }

            return (
              <div key={group.label}>
                {groupIndex > 0 && <DropdownMenuSeparator />}
                <DropdownMenuLabel className="text-xs uppercase text-gray-500 font-semibold">
                  {group.label}
                </DropdownMenuLabel>

                {/* Accessible views */}
                {accessibleInGroup.map((viewId) => {
                  const viewInfo = getViewInfo(viewId);
                  const Icon = viewIcons[viewId];
                  const isActive = currentView === viewId;

                  return (
                    <DropdownMenuItem
                      key={viewId}
                      onClick={() => {
                        setCurrentView(viewId);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-2 cursor-pointer",
                        isActive && "bg-blue-50 text-blue-700"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="flex-1">{viewInfo?.label}</span>
                      {isActive && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                  );
                })}

                {/* Locked views (shown grayed out) */}
                {lockedInGroup.map((viewId) => {
                  const viewInfo = getViewInfo(viewId);
                  const Icon = viewIcons[viewId];

                  return (
                    <DropdownMenuItem
                      key={viewId}
                      disabled
                      className="flex items-center gap-2 opacity-50 cursor-not-allowed"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="flex-1">{viewInfo?.label}</span>
                      <Lock className="h-3 w-3" />
                    </DropdownMenuItem>
                  );
                })}
              </div>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
