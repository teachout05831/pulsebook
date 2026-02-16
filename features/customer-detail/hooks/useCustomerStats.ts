"use client";

import { useState, useEffect, useCallback } from "react";
import type { CustomerStats } from "../types";

const DEFAULT_STATS: CustomerStats = {
  lifetimeValue: 0,
  activeJobs: 0,
  pendingEstimates: 0,
  balanceDue: 0,
  totalJobs: 0,
  completedJobs: 0,
  totalEstimates: 0,
  totalInvoices: 0,
};

const DEFAULT_COUNTS = {
  estimates: 0,
  jobs: 0,
  invoices: 0,
  files: 0,
  notes: 0,
};

export function useCustomerStats(customerId: string) {
  const [stats, setStats] = useState<CustomerStats>(DEFAULT_STATS);
  const [counts, setCounts] = useState(DEFAULT_COUNTS);

  const fetchStats = useCallback(async (signal?: AbortSignal) => {
    try {
      const res = await fetch(`/api/customers/${customerId}/stats`, { signal });
      if (!res.ok) return;
      const json = await res.json();
      if (json.data) {
        setStats(json.data.stats);
        setCounts(json.data.counts);
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      console.error("Error fetching stats:", error);
    }
  }, [customerId]);

  useEffect(() => {
    const controller = new AbortController();
    fetchStats(controller.signal);
    return () => controller.abort();
  }, [fetchStats]);

  const refetchStats = useCallback(() => fetchStats(), [fetchStats]);

  return { stats, counts, refetchStats };
}
