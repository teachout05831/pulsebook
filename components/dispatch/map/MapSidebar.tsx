"use client";

import { useMemo } from "react";
import { DispatchJob, DispatchCrew, DispatchTechnician } from "@/types/dispatch";
import { MapSidebarGroup } from "./MapSidebarGroup";
import { buildGroups } from "./map-helpers";
import type { MapGroupMode } from "./map-helpers";

interface MapSidebarProps {
  jobs: DispatchJob[];
  crews: DispatchCrew[];
  technicians: DispatchTechnician[];
  crewMap: Map<string, DispatchCrew>;
  techMap: Map<string, DispatchTechnician>;
  jobNumberMap: Map<string, number>;
  groupMode?: MapGroupMode;
  selectedJobId: string | null;
  onJobClick: (job: DispatchJob) => void;
  onMoved: (message: string) => void;
}

export function MapSidebar({
  jobs,
  crews,
  technicians,
  crewMap,
  techMap,
  jobNumberMap,
  groupMode = "crew",
  selectedJobId,
  onJobClick,
  onMoved,
}: MapSidebarProps) {
  const groups = useMemo(
    () => buildGroups(jobs, crews, technicians, crewMap, techMap, groupMode),
    [jobs, crews, technicians, crewMap, techMap, groupMode],
  );

  return (
    <div className="w-[240px] border-l border-gray-200 overflow-y-auto bg-white flex-shrink-0">
      <div className="px-3 py-2 border-b border-gray-100 text-[11px] font-semibold text-gray-600 flex justify-between items-center sticky top-0 bg-white z-[2]">
        <span>TODAY&apos;S JOBS ({jobs.length})</span>
      </div>
      {groups.map((group) => (
        <MapSidebarGroup
          key={group.key}
          group={group}
          groupMode={groupMode}
          jobNumberMap={jobNumberMap}
          selectedJobId={selectedJobId}
          onJobClick={onJobClick}
          onMoved={onMoved}
        />
      ))}
    </div>
  );
}
