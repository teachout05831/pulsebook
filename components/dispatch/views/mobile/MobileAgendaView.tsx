"use client";

import { useMemo, useCallback, useRef, useState } from "react";
import { useDispatch } from "../../dispatch-provider";
import { JobDetailDialog } from "../../job-details/JobDetailDialog";
import { MobileTechGroup } from "./cards/MobileTechGroup";
import { MobileUnassignedSection } from "./cards/MobileUnassignedSection";
import { MobileMapDrawer } from "./map/MobileMapDrawer";
import { DispatchJob } from "@/types/dispatch";

export function MobileAgendaView() {
  const { jobs, technicians, setSelectedJobId, setIsDetailsPanelOpen } = useDispatch();

  const [dialogJob, setDialogJob] = useState<DispatchJob | null>(null);
  const lastClickRef = useRef<{ id: string; time: number }>({ id: "", time: 0 });

  const handleJobClick = useCallback((job: DispatchJob) => {
    const now = Date.now();
    if (lastClickRef.current.id === job.id && now - lastClickRef.current.time < 400) {
      setDialogJob(job);
      lastClickRef.current = { id: "", time: 0 };
      return;
    }
    lastClickRef.current = { id: job.id, time: now };
    setSelectedJobId(job.id);
    setIsDetailsPanelOpen(true);
  }, [setSelectedJobId, setIsDetailsPanelOpen]);

  // Group jobs by technician
  const { techGroups, unassignedJobs } = useMemo(() => {
    const grouped = new Map<string, DispatchJob[]>();
    const unassigned: DispatchJob[] = [];

    technicians.forEach((tech) => grouped.set(tech.id, []));

    jobs.forEach((job) => {
      if (!job.assignedTechnicianId) {
        unassigned.push(job);
      } else {
        const current = grouped.get(job.assignedTechnicianId) || [];
        current.push(job);
        grouped.set(job.assignedTechnicianId, current);
      }
    });

    // Sort technicians by job count (busiest first)
    const groups = technicians
      .map((tech) => ({
        technician: tech,
        jobs: grouped.get(tech.id) || [],
      }))
      .filter((g) => g.jobs.length > 0)
      .sort((a, b) => b.jobs.length - a.jobs.length);

    return { techGroups: groups, unassignedJobs: unassigned };
  }, [jobs, technicians]);

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* Scrollable job list */}
      <div className="flex-1 overflow-y-auto">
        {/* Unassigned section at top */}
        <MobileUnassignedSection
          jobs={unassignedJobs}
          onJobClick={handleJobClick}
        />

        {/* Technician groups */}
        {techGroups.map(({ technician, jobs: techJobs }) => (
          <MobileTechGroup
            key={technician.id}
            technician={technician}
            jobs={techJobs}
            onJobClick={handleJobClick}
          />
        ))}

        {/* Empty state */}
        {techGroups.length === 0 && unassignedJobs.length === 0 && (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
            No jobs scheduled for this day
          </div>
        )}
      </div>

      {/* Bottom map drawer */}
      <MobileMapDrawer jobs={jobs} onJobClick={handleJobClick} />
      <JobDetailDialog job={dialogJob} open={!!dialogJob} onOpenChange={(o) => { if (!o) setDialogJob(null); }} />
    </div>
  );
}
