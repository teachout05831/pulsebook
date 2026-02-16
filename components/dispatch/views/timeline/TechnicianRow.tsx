"use client";

import React, { useMemo } from "react";
import { DispatchJob, DispatchTechnician } from "@/types/dispatch";
import { TechnicianAvatar } from "../../shared/technician-avatar";
import { DroppableZone } from "../../dnd";
import { TimelineJobBlock } from "./TimelineJobBlock";
import { HOURS, CELL_WIDTH, TIME_SLOTS, SLOT_WIDTH, getJobPosition } from "./constants";

interface TechnicianRowProps {
  technician: DispatchTechnician;
  jobs: DispatchJob[];
  onJobClick: (job: DispatchJob) => void;
}

// Calculate lane assignments for overlapping jobs
function assignLanes(jobs: DispatchJob[]): Map<string, number> {
  const laneMap = new Map<string, number>();
  if (jobs.length === 0) return laneMap;

  // Get positions for all jobs and sort by start position
  const jobsWithPos = jobs.map(job => {
    const { left, width } = getJobPosition(job, CELL_WIDTH);
    return { job, left, right: left + Math.max(width - 4, 96) };
  }).sort((a, b) => a.left - b.left);

  // Track end positions of jobs in each lane
  const laneEnds: number[] = [];

  for (const { job, left, right } of jobsWithPos) {
    // Find first lane where this job fits (doesn't overlap)
    let lane = 0;
    while (lane < laneEnds.length && laneEnds[lane] > left) {
      lane++;
    }
    laneMap.set(job.id, lane);
    laneEnds[lane] = right;
  }

  return laneMap;
}

const JOB_HEIGHT = 40; // Height per job lane
const ROW_PADDING = 8; // Top/bottom padding

export const TechnicianRow = React.memo(function TechnicianRow({ technician, jobs, onJobClick }: TechnicianRowProps) {
  // Calculate lanes for overlapping jobs
  const { laneMap, laneCount } = useMemo(() => {
    const map = assignLanes(jobs);
    const count = jobs.length > 0 ? Math.max(...Array.from(map.values())) + 1 : 1;
    return { laneMap: map, laneCount: count };
  }, [jobs]);

  // Dynamic row height based on number of lanes
  const rowHeight = Math.max(56, laneCount * JOB_HEIGHT + ROW_PADDING * 2);

  return (
    <div className="flex border-b border-gray-100 hover:bg-gray-50/30 transition-colors">
      {/* Technician info sidebar */}
      <div className="w-[200px] flex-shrink-0 border-r border-gray-100 py-2 px-3">
        <div className="flex items-center gap-2">
          <TechnicianAvatar technician={technician} showStatus />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-gray-900 truncate">{technician.name}</div>
            <div className="text-xs text-gray-500">
              {technician.todayCompletedCount}/{technician.todayJobCount} jobs
            </div>
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
              id={`${technician.id}-time-${hour}-${minute}`}
              style={{ width: SLOT_WIDTH, height: "100%" }}
              className={minute === 0 ? "border-l border-gray-100" : ""}
              activeClassName="bg-blue-100/60"
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
});
