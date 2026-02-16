"use client";

import { memo, useMemo } from "react";
import { X, Truck, UserRound } from "lucide-react";
import type { DispatchJob, DispatchCrew, DispatchTechnician } from "@/types/dispatch";
import { HOURS, CELL_WIDTH, SLOT_WIDTH, TIME_SLOTS as DND_SLOTS, getJobPosition } from "../timeline/constants";
import { DroppableZone } from "../../dnd";
import { AddCrewMemberPopover } from "../AddCrewMemberPopover";
import { CrewJobBlock } from "./CrewJobBlock";
import { shortName } from "./crew-helpers";

interface CrewRowProps {
  crew: DispatchCrew;
  jobs: DispatchJob[];
  availableTechs: DispatchTechnician[];
  onJobClick: (job: DispatchJob) => void;
  onAddMember: (crewId: string, tech: DispatchTechnician) => void;
  onRemoveMember: (crewId: string, memberId: string) => void;
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

export const CrewRow = memo(function CrewRow({ crew, jobs, availableTechs, onJobClick, onAddMember, onRemoveMember }: CrewRowProps) {
  const totalJobs = jobs.length;
  const completedJobs = jobs.filter(j => j.status === "completed").length;

  // Calculate lanes for overlapping jobs
  const { laneMap, laneCount } = useMemo(() => {
    const map = assignLanes(jobs);
    const count = jobs.length > 0 ? Math.max(...Array.from(map.values())) + 1 : 1;
    return { laneMap: map, laneCount: count };
  }, [jobs]);

  const timelineHeight = Math.max(56, laneCount * JOB_HEIGHT + ROW_PADDING * 2);

  return (
    <div className="flex items-stretch border-b border-gray-200">
      <div className="w-1.5 flex-shrink-0" style={{ backgroundColor: crew.color }} />

      <div className="w-[200px] flex-shrink-0 border-r border-gray-200 bg-white">
        <div className="flex items-center gap-2 px-3 pt-3 pb-1">
          <h3 className="font-semibold text-gray-900 text-sm flex-1 truncate">{crew.name}</h3>
          <span className="text-[10px] text-gray-400">{completedJobs}/{totalJobs}</span>
          <AddCrewMemberPopover
            availableTechs={availableTechs}
            crewId={crew.databaseId}
            onMemberAdded={async () => {}}
            onAddDirect={(tech) => onAddMember(crew.databaseId, tech)}
          />
        </div>

        {crew.vehicleName && (
          <div className="flex items-center gap-1 px-3 text-[10px] text-gray-400">
            <Truck className="w-3 h-3" />{crew.vehicleName}
          </div>
        )}

        <div className="px-3 pt-1.5 pb-3">
          {crew.members.length > 0 ? (
            <div className="border border-dashed border-gray-200 rounded-md px-2 py-1.5 space-y-0.5 bg-gray-50/50">
              {crew.members.map(tech => (
                <div key={tech.id} className="flex items-center gap-1.5 group/m">
                  <UserRound className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-600 flex-1 truncate">{shortName(tech.name)}</span>
                  <button
                    onClick={() => onRemoveMember(crew.databaseId, tech.databaseId)}
                    className="opacity-0 group-hover/m:opacity-100 text-gray-300 hover:text-red-500 transition-opacity flex-shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-gray-200 rounded-md px-2 py-3 text-center">
              <span className="text-[10px] text-gray-400">No members assigned</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 relative" style={{ minWidth: HOURS.length * CELL_WIDTH, minHeight: timelineHeight }}>
        <div className="absolute inset-0 flex">
          {DND_SLOTS.map(({ hour, minute }) => (
            <DroppableZone
              key={`${hour}-${minute}`}
              id={`crew-${crew.databaseId}-time-${hour}-${minute}`}
              style={{ width: SLOT_WIDTH, height: "100%" }}
              className={minute === 0 ? "border-l border-gray-100" : ""}
              activeClassName="bg-blue-100/60"
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
  );
});
