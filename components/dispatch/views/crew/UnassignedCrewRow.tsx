"use client";

import { useMemo } from "react";
import { AlertCircle } from "lucide-react";
import type { DispatchJob } from "@/types/dispatch";
import { Badge } from "@/components/ui/badge";
import { DroppableZone } from "../../dnd";
import { CrewJobBlock } from "./CrewJobBlock";
import { HOURS, CELL_WIDTH, TIME_SLOTS, SLOT_WIDTH, getJobPosition } from "../timeline/constants";

function assignLanes(jobs: DispatchJob[]): Map<string, number> {
  const laneMap = new Map<string, number>();
  if (jobs.length === 0) return laneMap;

  const jobsWithPos = jobs.map(job => {
    const { left, width } = getJobPosition(job, CELL_WIDTH);
    return { job, left, right: left + Math.max(width - 4, 96) };
  }).sort((a, b) => a.left - b.left);

  const laneEnds: number[] = [];
  for (const { job, left, right } of jobsWithPos) {
    let lane = 0;
    while (lane < laneEnds.length && laneEnds[lane] > left) {
      lane++;
    }
    laneMap.set(job.id, lane);
    laneEnds[lane] = right;
  }
  return laneMap;
}

const JOB_HEIGHT = 40;
const ROW_PADDING = 8;

export function UnassignedCrewRow({ jobs, onJobClick }: { jobs: DispatchJob[]; onJobClick: (job: DispatchJob) => void }) {
  const { laneMap, laneCount } = useMemo(() => {
    const map = assignLanes(jobs);
    const count = jobs.length > 0 ? Math.max(...Array.from(map.values())) + 1 : 1;
    return { laneMap: map, laneCount: count };
  }, [jobs]);

  const rowHeight = Math.max(56, laneCount * JOB_HEIGHT + ROW_PADDING * 2);

  return (
    <DroppableZone id="unassigned" activeClassName="ring-2 ring-red-400 ring-inset bg-red-100/50">
      <div className="border-b-2 border-red-200 bg-red-50/50">
        <div className="flex items-stretch">
          <div className="w-[202px] flex-shrink-0 border-r border-red-200 p-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <h3 className="font-semibold text-red-700 text-sm">Unassigned</h3>
              <Badge variant="outline" className="text-[10px] border-red-300 text-red-600">{jobs.length}</Badge>
            </div>
            {jobs.length === 0 && (
              <span className="text-[10px] text-gray-400 italic mt-1 block">Drop jobs here to unassign</span>
            )}
          </div>

          <div className="flex-1 relative" style={{ minWidth: HOURS.length * CELL_WIDTH, height: rowHeight }}>
            <div className="absolute inset-0 flex">
              {TIME_SLOTS.map(({ hour, minute }) => (
                <DroppableZone
                  key={`${hour}-${minute}`}
                  id={`unassigned-time-${hour}-${minute}`}
                  style={{ width: SLOT_WIDTH, height: "100%" }}
                  className={minute === 0 ? "border-l border-red-100/50" : ""}
                  activeClassName="bg-red-100/60"
                />
              ))}
            </div>
            {jobs.map(job => (
              <CrewJobBlock
                key={job.id}
                job={job}
                onJobClick={onJobClick}
                lane={laneMap.get(job.id) || 0}
                laneHeight={JOB_HEIGHT}
              />
            ))}
          </div>
        </div>
      </div>
    </DroppableZone>
  );
}
