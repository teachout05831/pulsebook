"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { ArrowUpDown, Filter, ChevronDown } from "lucide-react";
import { useDispatch } from "../../../dispatch-provider";
import { JobDetailDialog } from "../../../job-details/JobDetailDialog";
import { MobileListRow } from "./MobileListRow";
import type { DispatchJob } from "@/types/dispatch";

type SortField = "time" | "status" | "tech";

const STATUS_ORDER: DispatchJob["status"][] = [
  "unassigned", "in_progress", "scheduled", "completed", "cancelled",
];

export function MobileListView() {
  const {
    jobs,
    setSelectedJobId,
    setIsDetailsPanelOpen,
  } = useDispatch();

  const [sortField, setSortField] = useState<SortField>("time");
  const [filterStatus, setFilterStatus] = useState<string>("all");

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

  const sortedJobs = useMemo(() => {
    let result = [...jobs];

    if (filterStatus !== "all") {
      result = result.filter((j) => j.status === filterStatus);
    }

    result.sort((a, b) => {
      if (sortField === "time") {
        const timeA = a.scheduledTime || "99:99";
        const timeB = b.scheduledTime || "99:99";
        return timeA.localeCompare(timeB);
      }
      if (sortField === "status") {
        return STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status);
      }
      const nameA = a.assignedTechnicianName || a.assignedCrewName || "zzz";
      const nameB = b.assignedTechnicianName || b.assignedCrewName || "zzz";
      return nameA.localeCompare(nameB);
    });

    return result;
  }, [jobs, sortField, filterStatus]);

  const cycleSortField = () => {
    setSortField((s) => s === "time" ? "status" : s === "status" ? "tech" : "time");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sort/Filter bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={cycleSortField}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 border border-gray-200 rounded bg-white"
          >
            <ArrowUpDown className="w-3 h-3" />
            {sortField === "time" ? "Time" : sortField === "status" ? "Status" : "Tech"}
          </button>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none pl-6 pr-5 py-1 text-xs text-gray-600 border border-gray-200 rounded bg-white"
            >
              <option value="all">All Status</option>
              <option value="unassigned">Unassigned</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <Filter className="absolute left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
            <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <span className="text-xs text-gray-400">{sortedJobs.length} jobs</span>
      </div>

      {/* List rows */}
      <div className="flex-1 overflow-y-auto bg-white">
        {sortedJobs.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
            No jobs match filters
          </div>
        ) : (
          sortedJobs.map((job) => (
            <MobileListRow key={job.id} job={job} onViewDetails={handleJobClick} />
          ))
        )}
        <div className="h-8" />
      </div>
      <JobDetailDialog job={dialogJob} open={!!dialogJob} onOpenChange={(o) => { if (!o) setDialogJob(null); }} />
    </div>
  );
}
