"use client";

import { useCallback } from "react";
import { MapPin } from "lucide-react";
import { useBottomDrawer } from "@/hooks/use-bottom-drawer";
import { DispatchJob } from "@/types/dispatch";
import { cn } from "@/lib/utils";

interface MobileMapDrawerProps {
  jobs: DispatchJob[];
  onJobClick: (job: DispatchJob) => void;
}

const statusColor: Record<string, string> = {
  in_progress: "bg-yellow-500",
  completed: "bg-green-500",
  unassigned: "bg-red-500",
  scheduled: "bg-blue-500",
  cancelled: "bg-gray-400",
};

export function MobileMapDrawer({ jobs, onJobClick }: MobileMapDrawerProps) {
  const { height, isDragging, handlers, containerRef } = useBottomDrawer({
    collapsed: 40,
    half: 0,
    fullRatio: 0.6,
    maxRatio: 0.75,
  });

  const isCollapsed = height <= 44;

  const handleTap = useCallback(() => {
    // Handled by useBottomDrawer's onDoubleClick
  }, []);

  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className="border-t-2 border-gray-200 bg-white flex-shrink-0 flex flex-col"
      style={{
        height: `${height}px`,
        transition: isDragging ? "none" : "height 0.3s ease",
        overflow: isCollapsed ? "hidden" : "visible",
      }}
    >
      {/* Swipe handle */}
      <div
        className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 cursor-row-resize select-none touch-none"
        {...handlers}
      >
        <div className="w-8 h-1 rounded-full bg-gray-300" />
        <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
          🗺 Map
        </span>
        <span className="text-xs font-semibold text-blue-600">{jobs.length} pins</span>
      </div>

      {/* Map placeholder (full width on mobile) */}
      {!isCollapsed && (
        <div className="flex-1 bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center relative overflow-hidden">
          <div className="text-center text-indigo-600">
            <MapPin className="w-6 h-6 mx-auto mb-1" />
            <div className="text-xs font-medium">Google Maps</div>
            <div className="text-[10px] opacity-75">Integration coming soon</div>
          </div>

          {/* Job list overlay at bottom of map */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 border-t border-gray-200 max-h-[120px] overflow-y-auto">
            {jobs.slice(0, 6).map((job, i) => (
              <div
                key={job.id}
                className="flex items-center gap-2.5 px-3 py-2 border-b border-gray-50"
                onClick={() => onJobClick(job)}
              >
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0",
                  statusColor[job.status] || "bg-blue-500"
                )}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate">{job.title}</div>
                  <div className="text-[10px] text-gray-400 truncate">{job.address}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
