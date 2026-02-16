"use client";

import { useMemo, useCallback, useRef, useState } from "react";
import { ArrowUpDown, Pointer } from "lucide-react";
import { useDispatch } from "../../../dispatch-provider";
import { JobDetailDialog } from "../../../job-details/JobDetailDialog";
import { MobileTimelineTechRow } from "./MobileTimelineTechRow";
import { HOURS, START_HOUR } from "../../timeline/constants";
import type { DispatchJob } from "@/types/dispatch";

const MOBILE_CELL = 80;

export function MobileTimelineView() {
  const {
    jobs,
    technicians,
    setSelectedJobId,
    setIsDetailsPanelOpen,
  } = useDispatch();

  const [dialogJob, setDialogJob] = useState<DispatchJob | null>(null);
  const lastClickRef = useRef<{ id: string; time: number }>({ id: "", time: 0 });

  const handleJobClick = useCallback(
    (job: DispatchJob) => {
      const now = Date.now();
      if (lastClickRef.current.id === job.id && now - lastClickRef.current.time < 400) {
        setDialogJob(job);
        lastClickRef.current = { id: "", time: 0 };
        return;
      }
      lastClickRef.current = { id: job.id, time: now };
      setSelectedJobId(job.id);
      setIsDetailsPanelOpen(true);
    },
    [setSelectedJobId, setIsDetailsPanelOpen]
  );

  // Calculate "now" offset
  const nowOffset = useMemo(() => {
    const now = new Date();
    const decimal = now.getHours() + now.getMinutes() / 60;
    return (decimal - START_HOUR) * MOBILE_CELL;
  }, []);

  // Group jobs by technician
  const { techRows, unassignedJobs } = useMemo(() => {
    const assigned = new Map<string, DispatchJob[]>();
    const unassigned: DispatchJob[] = [];

    for (const job of jobs) {
      if (job.status === "cancelled") continue;
      if (!job.assignedTechnicianId) {
        unassigned.push(job);
      } else {
        const existing = assigned.get(job.assignedTechnicianId) || [];
        existing.push(job);
        assigned.set(job.assignedTechnicianId, existing);
      }
    }

    const rows = technicians
      .filter((t) => t.isActive)
      .map((tech) => ({
        technician: tech,
        jobs: assigned.get(tech.id) || [],
      }));

    return { techRows: rows, unassignedJobs: unassigned };
  }, [jobs, technicians]);

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable timeline rows */}
      <div className="flex-1 overflow-y-auto bg-white">
        {techRows.map(({ technician, jobs: techJobs }) => (
          <MobileTimelineTechRow
            key={technician.id}
            technician={technician}
            jobs={techJobs}
            nowOffset={nowOffset}
            onJobClick={handleJobClick}
          />
        ))}

        {unassignedJobs.length > 0 && (
          <MobileTimelineTechRow
            jobs={unassignedJobs}
            isUnassigned
            nowOffset={nowOffset}
            onJobClick={handleJobClick}
          />
        )}

        {/* Helper hint */}
        <div className="px-4 py-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
            <ArrowUpDown className="w-4 h-4" />
            Swipe timeline rows left/right to see full schedule
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
            <Pointer className="w-4 h-4" />
            Tap job blocks to view details
          </div>
        </div>
      </div>
      <JobDetailDialog job={dialogJob} open={!!dialogJob} onOpenChange={(o) => { if (!o) setDialogJob(null); }} />
    </div>
  );
}
