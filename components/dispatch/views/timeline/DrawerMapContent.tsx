"use client";

import { DispatchJob, DispatchCrew, DispatchTechnician } from "@/types/dispatch";
import { DispatchMap } from "../../map";
import type { MapGroupMode } from "../../map";

interface DrawerMapContentProps {
  jobs: DispatchJob[];
  crews?: DispatchCrew[];
  technicians?: DispatchTechnician[];
  groupMode?: MapGroupMode;
  onJobClick: (job: DispatchJob) => void;
}

export default function DrawerMapContent({
  jobs,
  crews,
  technicians,
  groupMode,
  onJobClick,
}: DrawerMapContentProps) {
  return (
    <DispatchMap
      jobs={jobs}
      crews={crews}
      technicians={technicians}
      groupMode={groupMode}
      onJobClick={onJobClick}
    />
  );
}
