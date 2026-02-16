"use client";

import { useMemo, useCallback, useRef, useState } from "react";
import { Users } from "lucide-react";
import { useDispatch } from "../../dispatch-provider";
import { JobDetailDialog } from "../../job-details/JobDetailDialog";
import { DispatchJob } from "@/types/dispatch";
import { TechnicianResourceCard } from "./TechnicianResourceCard";
import { UnassignedJobsPanel } from "./UnassignedJobsPanel";

export function ResourceView() {
  const { jobs, technicians, setSelectedJobId, setIsDetailsPanelOpen, stats } = useDispatch();

  const jobsByTechnician = useMemo(() => {
    const groups = new Map<string, DispatchJob[]>();
    technicians.forEach(tech => groups.set(tech.id, []));
    jobs.forEach(job => {
      if (job.assignedTechnicianId) {
        const current = groups.get(job.assignedTechnicianId) || [];
        current.push(job);
        groups.set(job.assignedTechnicianId, current);
      }
    });
    return groups;
  }, [jobs, technicians]);

  const unassignedJobs = useMemo(
    () => jobs.filter(j => !j.assignedTechnicianId),
    [jobs]
  );

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

  const sortedTechnicians = useMemo(() => {
    return [...technicians].sort((a, b) => {
      const aJobs = jobsByTechnician.get(a.id)?.length || 0;
      const bJobs = jobsByTechnician.get(b.id)?.length || 0;
      return bJobs - aJobs;
    });
  }, [technicians, jobsByTechnician]);

  const { totalTechnicians, activeTechnicians, totalScheduledMinutes, avgJobsPerTech } = useMemo(() => {
    const total = technicians.length;
    const active = technicians.filter(t => t.status === "available" || t.status === "busy").length;
    const minutes = jobs.reduce((sum, job) => sum + (job.estimatedDuration || 60), 0);
    const avg = total > 0 ? Math.round(jobs.length / total * 10) / 10 : 0;
    return { totalTechnicians: total, activeTechnicians: active, totalScheduledMinutes: minutes, avgJobsPerTech: avg };
  }, [technicians, jobs]);

  return (
    <>
    <div className="h-full overflow-auto p-6 bg-gray-50">
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Resource Overview</h2>
              <div className="text-sm text-gray-500">{activeTechnicians} of {totalTechnicians} technicians active</div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-500">Total Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.unassigned}</div>
              <div className="text-xs text-gray-500">Unassigned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{avgJobsPerTech}</div>
              <div className="text-xs text-gray-500">Avg/Tech</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Math.floor(totalScheduledMinutes / 60)}h</div>
              <div className="text-xs text-gray-500">Total Time</div>
            </div>
          </div>
        </div>
      </div>

      <UnassignedJobsPanel jobs={unassignedJobs} onJobClick={handleJobClick} />

      <div className="space-y-4">
        {sortedTechnicians.map(technician => (
          <TechnicianResourceCard
            key={technician.id}
            technician={technician}
            jobs={jobsByTechnician.get(technician.id) || []}
            onJobClick={handleJobClick}
          />
        ))}
      </div>

      {technicians.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <div className="text-lg font-medium mb-1">No technicians found</div>
          <div className="text-sm">Add technicians to see resource allocation</div>
        </div>
      )}
    </div>
    <JobDetailDialog job={dialogJob} open={!!dialogJob} onOpenChange={(o) => { if (!o) setDialogJob(null); }} />
    </>
  );
}
