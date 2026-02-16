"use client";

import { useMemo, useCallback, useRef, useState } from "react";
import { Clock, Calendar } from "lucide-react";
import { useDispatch } from "../../dispatch-provider";
import { JobDetailDialog } from "../../job-details/JobDetailDialog";
import type { DispatchJob } from "@/types/dispatch";
import { DayGroup } from "./DayGroup";

export function AgendaView() {
  const { jobs, setSelectedJobId, setIsDetailsPanelOpen } = useDispatch();

  const jobsByDate = useMemo(() => {
    const groups = new Map<string, DispatchJob[]>();
    const sortedJobs = [...jobs].sort((a, b) => {
      const dateCompare = a.scheduledDate.localeCompare(b.scheduledDate);
      if (dateCompare !== 0) return dateCompare;
      return (a.scheduledTime || "00:00").localeCompare(b.scheduledTime || "00:00");
    });
    sortedJobs.forEach(job => {
      const current = groups.get(job.scheduledDate) || [];
      current.push(job);
      groups.set(job.scheduledDate, current);
    });
    return groups;
  }, [jobs]);

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

  const dateKeys = Array.from(jobsByDate.keys()).sort();

  if (jobs.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <div className="text-lg font-medium mb-1">No jobs scheduled</div>
          <div className="text-sm">No jobs found for the selected date range</div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="h-full overflow-auto p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">Agenda Overview</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-gray-500">Total Jobs:</span>{" "}
                <span className="font-semibold text-gray-900">{jobs.length}</span>
              </div>
              <div>
                <span className="text-gray-500">Days:</span>{" "}
                <span className="font-semibold text-gray-900">{dateKeys.length}</span>
              </div>
            </div>
          </div>
        </div>
        {dateKeys.map(date => (
          <DayGroup key={date} date={date} jobs={jobsByDate.get(date) || []} onJobClick={handleJobClick} />
        ))}
      </div>
    </div>
    <JobDetailDialog job={dialogJob} open={!!dialogJob} onOpenChange={(o) => { if (!o) setDialogJob(null); }} />
    </>
  );
}
