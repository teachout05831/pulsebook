import { memo } from "react";
import { DispatchJob } from "@/types/dispatch";
import { MapSidebarJob } from "./MapSidebarJob";
import type { MapGroup, MapGroupMode } from "./map-helpers";

interface MapSidebarGroupProps {
  group: MapGroup;
  groupMode: MapGroupMode;
  jobNumberMap: Map<string, number>;
  selectedJobId: string | null;
  onJobClick: (job: DispatchJob) => void;
  onMoved: (message: string) => void;
}

export const MapSidebarGroup = memo(function MapSidebarGroup({
  group, groupMode, jobNumberMap, selectedJobId, onJobClick, onMoved,
}: MapSidebarGroupProps) {
  return (
    <div>
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50/80 border-b border-gray-100">
        <div
          className="w-[10px] h-[10px] rounded-sm flex-shrink-0"
          style={{ backgroundColor: group.color }}
        />
        <span className="text-[11px] font-semibold text-gray-800">
          {group.label}
        </span>
        <span className="text-[10px] text-gray-400 ml-auto">
          {group.jobs.length} jobs
        </span>
      </div>
      {group.jobs.map((job) => (
        <MapSidebarJob
          key={job.id}
          job={job}
          color={group.color}
          number={jobNumberMap.get(job.id) || 0}
          isSelected={selectedJobId === job.id}
          onClick={() => onJobClick(job)}
          groupMode={groupMode}
          onMoved={onMoved}
        />
      ))}
    </div>
  );
});
