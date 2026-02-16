"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Customer } from "@/types";
import type { Job } from "@/types/job";
import type { Estimate } from "@/types/estimate";
import type { Invoice } from "@/types/invoice";
import type { CustomerStats, CustomerTab } from "../types";

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

export function useCustomerDetail(customerId: string) {
  // Core state - loaded first (priority)
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [stats, setStats] = useState<CustomerStats>(DEFAULT_STATS);
  const [counts, setCounts] = useState(DEFAULT_COUNTS);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Tab data - loaded on demand
  const [jobs, setJobs] = useState<Job[]>([]);
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Track which tabs have been loaded
  const loadedTabs = useRef<Set<CustomerTab>>(new Set());
  const [tabsLoading, setTabsLoading] = useState<Record<string, boolean>>({});

  // Fetch customer data (priority - loaded first)
  const fetchCustomer = useCallback(async (signal?: AbortSignal) => {
    try {
      const res = await fetch(`/api/customers/${customerId}`, { signal });
      if (!res.ok) throw new Error("Failed to fetch customer");
      const json = await res.json();
      setCustomer(json.data);
      return true;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return false;
      console.error("Error fetching customer:", error);
      setIsError(true);
      return false;
    }
  }, [customerId]);

  // Fetch stats from server (lightweight, accurate counts)
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

  // Tab data fetchers - called on demand
  const fetchJobs = useCallback(async (signal?: AbortSignal) => {
    if (loadedTabs.current.has("jobs")) return;
    setTabsLoading(prev => ({ ...prev, jobs: true }));
    try {
      const res = await fetch(
        `/api/jobs?customerId=${customerId}&_limit=50&_sort=scheduled_date&_order=desc`,
        { signal }
      );
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const json = await res.json();
      setJobs(json.data || []);
      loadedTabs.current.add("jobs");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      console.error("Error fetching jobs:", error);
    } finally {
      setTabsLoading(prev => ({ ...prev, jobs: false }));
    }
  }, [customerId]);

  const fetchEstimates = useCallback(async (signal?: AbortSignal) => {
    if (loadedTabs.current.has("estimates")) return;
    setTabsLoading(prev => ({ ...prev, estimates: true }));
    try {
      const res = await fetch(
        `/api/estimates?customerId=${customerId}&_limit=50`,
        { signal }
      );
      if (!res.ok) throw new Error("Failed to fetch estimates");
      const json = await res.json();
      setEstimates(json.data || []);
      loadedTabs.current.add("estimates");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      console.error("Error fetching estimates:", error);
    } finally {
      setTabsLoading(prev => ({ ...prev, estimates: false }));
    }
  }, [customerId]);

  const fetchInvoices = useCallback(async (signal?: AbortSignal) => {
    if (loadedTabs.current.has("invoices")) return;
    setTabsLoading(prev => ({ ...prev, invoices: true }));
    try {
      const res = await fetch(
        `/api/invoices?customerId=${customerId}&_limit=50`,
        { signal }
      );
      if (!res.ok) throw new Error("Failed to fetch invoices");
      const json = await res.json();
      setInvoices(json.data || []);
      loadedTabs.current.add("invoices");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      console.error("Error fetching invoices:", error);
    } finally {
      setTabsLoading(prev => ({ ...prev, invoices: false }));
    }
  }, [customerId]);

  // Load tab data on demand
  const loadTabData = useCallback((tab: CustomerTab) => {
    const controller = new AbortController();
    switch (tab) {
      case "jobs":
        fetchJobs(controller.signal);
        break;
      case "estimates":
        fetchEstimates(controller.signal);
        break;
      case "invoices":
        fetchInvoices(controller.signal);
        break;
      case "overview":
        // Overview needs jobs for upcoming jobs display
        fetchJobs(controller.signal);
        break;
    }
    return () => controller.abort();
  }, [fetchJobs, fetchEstimates, fetchInvoices]);

  // Force refresh functions
  const refetchCustomer = useCallback(() => fetchCustomer(), [fetchCustomer]);

  const refetchJobs = useCallback(() => {
    loadedTabs.current.delete("jobs");
    return fetchJobs();
  }, [fetchJobs]);

  const refetchEstimates = useCallback(() => {
    loadedTabs.current.delete("estimates");
    return fetchEstimates();
  }, [fetchEstimates]);

  const refetchInvoices = useCallback(() => {
    loadedTabs.current.delete("invoices");
    return fetchInvoices();
  }, [fetchInvoices]);

  const refetchStats = useCallback(() => fetchStats(), [fetchStats]);

  // Initial load - customer + stats only (fast)
  useEffect(() => {
    const controller = new AbortController();
    loadedTabs.current = new Set();

    const loadInitialData = async () => {
      setIsLoading(true);
      setIsError(false);

      // Load customer first (priority), stats in parallel
      const [customerSuccess] = await Promise.all([
        fetchCustomer(controller.signal),
        fetchStats(controller.signal),
      ]);

      if (!controller.signal.aborted) {
        setIsLoading(false);

        // Pre-fetch jobs for overview tab (needed for upcoming jobs)
        if (customerSuccess) {
          fetchJobs(controller.signal);
        }
      }
    };

    loadInitialData();
    return () => controller.abort();
  }, [fetchCustomer, fetchStats, fetchJobs]);

  return {
    // Core data (always available after initial load)
    customer,
    isLoading,
    isError,
    stats,
    counts,

    // Tab data (loaded on demand)
    jobs,
    estimates,
    invoices,
    tabsLoading,

    // Load tab data on demand
    loadTabData,

    // Refresh functions
    refetchCustomer,
    refetchJobs,
    refetchEstimates,
    refetchInvoices,
    refetchStats,
  };
}
