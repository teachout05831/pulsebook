"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import type { DispatchJob, DispatchStats, DispatchStatus, DispatchFilters, DispatchDateRange, DispatchTechnician, DispatchCrew } from "@/types/dispatch";
import { applyStatusUpdate, applyAssignJob, applyAssignCrew, applyRescheduleJob } from "./dispatch-optimistic";

export { useDateNavigation } from "./use-date-navigation";

interface DispatchDataState {
  jobs: DispatchJob[];
  technicians: DispatchTechnician[];
  crews: DispatchCrew[];
  stats: DispatchStats;
  dispatchStatus: DispatchStatus;
  isLoading: boolean;
  error: Error | null;
}

const DEFAULT_FILTERS: DispatchFilters = { technicianIds: [], crewIds: [], statuses: [], priorities: [], searchQuery: "" };
const DEFAULT_STATUS: DispatchStatus = { isDispatched: false, dispatchedAt: null, dispatchedBy: null, hasChangesAfterDispatch: false };

export function useDispatchData(options: { dateRange: DispatchDateRange; filters?: DispatchFilters; refreshInterval?: number }) {
  const { dateRange, filters = DEFAULT_FILTERS, refreshInterval = 0 } = options;

  const abortRef = useRef<AbortController | null>(null);

  const [state, setState] = useState<DispatchDataState>({
    jobs: [], technicians: [], crews: [],
    stats: { total: 0, unassigned: 0, scheduled: 0, inProgress: 0, completed: 0, cancelled: 0 },
    dispatchStatus: DEFAULT_STATUS, isLoading: true, error: null,
  });

  const dateKey = `${dateRange.start.toISOString().split("T")[0]}_${dateRange.end.toISOString().split("T")[0]}`;
  const filtersKey = JSON.stringify([filters.technicianIds, filters.crewIds, filters.statuses, filters.searchQuery]);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set("startDate", dateRange.start.toISOString().split("T")[0]);
    params.set("endDate", dateRange.end.toISOString().split("T")[0]);
    if (filters.technicianIds.length > 0) params.set("technicianIds", filters.technicianIds.join(","));
    if (filters.crewIds && filters.crewIds.length > 0) params.set("crewIds", filters.crewIds.join(","));
    if (filters.statuses.length > 0) params.set("statuses", filters.statuses.join(","));
    if (filters.searchQuery) params.set("q", filters.searchQuery);
    return params.toString();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey, filtersKey]);

  const fetchData = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setState(prev => prev.jobs.length > 0
      ? { ...prev, error: null }
      : { ...prev, isLoading: true, error: null },
    );
    for (let attempt = 0; attempt <= 2; attempt++) {
      if (controller.signal.aborted) return;
      try {
        const response = await fetch(`/api/dispatch?${queryParams}`, { signal: controller.signal });
        if (!response.ok) throw new Error(`Failed to fetch dispatch data: ${response.statusText}`);
        const data = await response.json();
        setState({
          jobs: data.jobs, technicians: data.technicians, crews: data.crews || [],
          stats: data.stats, dispatchStatus: data.dispatchStatus || DEFAULT_STATUS, isLoading: false, error: null,
        });
        return;
      } catch (error) {
        if (controller.signal.aborted) return;
        if (attempt < 2) { await new Promise(r => setTimeout(r, 1000 * (attempt + 1))); continue; }
        setState(prev => ({ ...prev, isLoading: false, error: error instanceof Error ? error : new Error("Failed to connect") }));
      }
    }
  }, [queryParams]);

  useEffect(() => { fetchData(); return () => { abortRef.current?.abort(); }; }, [fetchData]);
  useEffect(() => {
    if (refreshInterval <= 0) return;
    const id = setInterval(fetchData, refreshInterval * 1000);
    return () => clearInterval(id);
  }, [fetchData, refreshInterval]);

  const updateJob = useCallback(async (jobId: string, updates: Partial<DispatchJob>) => {
    try {
      const res = await fetch("/api/dispatch", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId, updates }) });
      if (!res.ok) throw new Error("Failed to update job");
    } catch (error) { console.error("Error updating job:", error); await fetchData(); throw error; }
  }, [fetchData]);
  const optimisticUpdateJobStatus = useCallback((jobId: string, status: DispatchJob["status"]) => setState(prev => applyStatusUpdate(prev, jobId, status)), []);
  const optimisticAssignJob = useCallback((jobId: string, techId: string | null, techName: string | null) => setState(prev => applyAssignJob(prev, jobId, techId, techName)), []);
  const optimisticAssignCrew = useCallback((jobId: string, crewId: string | null, crewName: string | null) => setState(prev => applyAssignCrew(prev, jobId, crewId, crewName)), []);
  const optimisticRescheduleJob = useCallback((jobId: string, date: string, time: string | null) => setState(prev => applyRescheduleJob(prev, jobId, date, time)), []);

  return {
    ...state, refetch: fetchData, updateJob,
    optimisticUpdateJobStatus, optimisticAssignJob, optimisticAssignCrew, optimisticRescheduleJob,
  };
}
