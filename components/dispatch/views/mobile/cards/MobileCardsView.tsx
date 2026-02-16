"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { Users, ChevronDown } from "lucide-react";
import { useDispatch } from "../../../dispatch-provider";
import { JobDetailDialog } from "../../../job-details/JobDetailDialog";
import { MobileJobCard } from "./MobileJobCard";
import type { DispatchJob } from "@/types/dispatch";

export function MobileCardsView() {
  const {
    jobs,
    technicians,
    setSelectedJobId,
    setIsDetailsPanelOpen,
    filters,
  } = useDispatch();

  const [filterTechId, setFilterTechId] = useState<string>("all");

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

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    if (filterTechId !== "all") {
      result = result.filter(
        (j) => j.assignedTechnicianId === filterTechId || (!j.assignedTechnicianId && filterTechId === "unassigned")
      );
    }

    // Sort: unassigned first, then by time
    result.sort((a, b) => {
      if (a.status === "unassigned" && b.status !== "unassigned") return -1;
      if (b.status === "unassigned" && a.status !== "unassigned") return 1;
      if (a.status === "completed" && b.status !== "completed") return 1;
      if (b.status === "completed" && a.status !== "completed") return -1;
      const timeA = a.scheduledTime || "99:99";
      const timeB = b.scheduledTime || "99:99";
      return timeA.localeCompare(timeB);
    });

    return result;
  }, [jobs, filterTechId]);

  return (
    <div className="flex flex-col h-full">
      {/* Technician filter row */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white border-b border-gray-200">
        <div className="relative">
          <select
            value={filterTechId}
            onChange={(e) => setFilterTechId(e.target.value)}
            className="appearance-none flex items-center gap-1.5 pl-8 pr-6 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 bg-white"
          >
            <option value="all">All Techs</option>
            <option value="unassigned">Unassigned</option>
            {technicians.filter((t) => t.isActive).map((tech) => (
              <option key={tech.id} value={tech.id}>
                {tech.name}
              </option>
            ))}
          </select>
          <Users className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
        </div>
        <span className="text-xs text-gray-400 ml-auto">
          {filteredJobs.length} jobs
        </span>
      </div>

      {/* Scrollable cards */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {filteredJobs.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
            No jobs match filters
          </div>
        ) : (
          filteredJobs.map((job) => (
            <MobileJobCard
              key={job.id}
              job={job}
              onViewDetails={handleJobClick}
            />
          ))
        )}
        <div className="h-8" />
      </div>
      <JobDetailDialog job={dialogJob} open={!!dialogJob} onOpenChange={(o) => { if (!o) setDialogJob(null); }} />
    </div>
  );
}
