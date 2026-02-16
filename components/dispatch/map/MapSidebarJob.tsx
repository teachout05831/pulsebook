import { memo } from "react";
import { DispatchJob } from "@/types/dispatch";
import { cn } from "@/lib/utils";
import { MapJobMovePopover } from "./MapJobMovePopover";
import type { MapGroupMode } from "./map-helpers";

interface MapSidebarJobProps {
  job: DispatchJob;
  color: string;
  number: number;
  isSelected: boolean;
  onClick: () => void;
  groupMode: MapGroupMode;
  onMoved: (message: string) => void;
}

export const MapSidebarJob = memo(function MapSidebarJob({
  job, color, number, isSelected, onClick, groupMode, onMoved,
}: MapSidebarJobProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-2 border-b border-gray-50 hover:bg-gray-50 cursor-pointer group",
        isSelected && "bg-blue-50 border-l-[3px] border-l-blue-600",
      )}
    >
      <MapJobMovePopover job={job} groupMode={groupMode} onMoved={onMoved} />
      <div
        className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 shadow-sm ring-1 ring-black/10"
        style={{ backgroundColor: color }}
      >
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-xs text-gray-900 truncate">{job.title}</div>
        <div className="text-[10px] text-gray-400 truncate">{job.address}</div>
        <div className="text-[10px] text-gray-500">{job.scheduledTime || "Unscheduled"}</div>
      </div>
    </div>
  );
});
