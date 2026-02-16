"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch } from "../../dispatch-provider";
import type { DispatchJob } from "@/types/dispatch";
import { JobDetailDialog } from "../../job-details/JobDetailDialog";
import { CardsJobCard } from "./CardsJobCard";

type SortOption = "time" | "customer" | "status";

export function CardsView() {
  const { jobs, technicians, setSelectedJobId, setIsDetailsPanelOpen, updateJob } = useDispatch();
  const [sortBy, setSortBy] = useState<SortOption>("time");
  const [filterTechnician, setFilterTechnician] = useState<string>("all");

  const displayedJobs = useMemo(() => {
    let filtered = [...jobs];
    if (filterTechnician !== "all") {
      filtered = filtered.filter(j => j.assignedTechnicianId === filterTechnician);
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "time": return (a.scheduledTime || "99:99").localeCompare(b.scheduledTime || "99:99");
        case "customer": return a.customerName.localeCompare(b.customerName);
        case "status": return a.status.localeCompare(b.status);
        default: return 0;
      }
    });
    return filtered;
  }, [jobs, sortBy, filterTechnician]);

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

  const handleStatusChange = async (jobId: string, status: DispatchJob["status"]) => {
    await updateJob(jobId, { status });
  };

  return (
    <>
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <Select value={sortBy} onValueChange={(v: SortOption) => setSortBy(v)}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="time">Time</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Technician:</span>
          <Select value={filterTechnician} onValueChange={setFilterTechnician}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Technicians</SelectItem>
              {technicians.map(tech => (
                <SelectItem key={tech.id} value={tech.id}>{tech.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="text-sm text-gray-400 ml-auto">{displayedJobs.length} jobs</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayedJobs.map(job => (
          <CardsJobCard
            key={job.id}
            job={job}
            onClick={() => handleJobClick(job)}
            onStatusChange={(status) => handleStatusChange(job.id, status)}
          />
        ))}
      </div>
      {displayedJobs.length === 0 && (
        <div className="text-center py-12 text-gray-500"><p>No jobs found</p></div>
      )}
    </div>
    <JobDetailDialog job={dialogJob} open={!!dialogJob} onOpenChange={(o) => { if (!o) setDialogJob(null); }} />
    </>
  );
}
