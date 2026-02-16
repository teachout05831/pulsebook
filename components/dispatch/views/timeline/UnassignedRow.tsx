"use client";

import { useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { DispatchJob } from "@/types/dispatch";
import { DroppableZone } from "../../dnd";
import { TimelineJobBlock } from "./TimelineJobBlock";
import { HOURS, CELL_WIDTH, TIME_SLOTS, SLOT_WIDTH, getJobPosition } from "./constants";

interface UnassignedRowProps {
  jobs: DispatchJob[];
  onJobClick: (job: DispatchJob) => void;
}

// Calculate lane assignments for overlapping jobs
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

export function UnassignedRow({ jobs, onJobClick }: UnassignedRowProps) {
  const { laneMap, laneCount } = useMemo(() => {
    const map = assignLanes(jobs);
    const count = jobs.length > 0 ? Math.max(...Array.from(map.values())) + 1 : 1;
    return { laneMap: map, laneCount: count };
  }, [jobs]);

  if (jobs.length === 0) return null;

  const rowHeight = Math.max(56, laneCount * JOB_HEIGHT + ROW_PADDING * 2);

  return (
    <div className="flex border-b border-gray-100 bg-red-50/20 hover:bg-red-50/40 transition-colors">
      {/* Unassigned label sidebar */}
      <div className="w-[200px] flex-shrink-0 border-r border-gray-100 py-2 px-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-red-700">Unassigned</div>
            <div className="text-xs text-red-500">{jobs.length} job{jobs.length !== 1 ? "s" : ""}</div>
          </div>
        </div>
      </div>

      {/* Timeline area with 15-minute drop zones */}
      <div className="flex-1 relative" style={{ minWidth: HOURS.length * CELL_WIDTH, height: rowHeight }}>
        {/* Drop zones layer - 15-minute intervals */}
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

        {/* Job blocks layer */}
        {jobs.map((job) => (
          <TimelineJobBlock
            key={job.id}
            job={job}
            onJobClick={onJobClick}
            lane={laneMap.get(job.id) || 0}
            laneHeight={JOB_HEIGHT}
          />
        ))}
      </div>
    </div>
  );
}
