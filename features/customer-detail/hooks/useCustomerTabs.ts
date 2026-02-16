"use client";

import { useState, useCallback, useRef } from "react";
import type { Job } from "@/types/job";
import type { Estimate } from "@/types/estimate";
import type { Invoice } from "@/types/invoice";
import type { CustomerTab } from "../types";

export function useCustomerTabs(customerId: string) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const loadedTabs = useRef<Set<CustomerTab>>(new Set());
  const [tabsLoading, setTabsLoading] = useState<Record<string, boolean>>({});

  const fetchTab = useCallback(async (tab: "jobs" | "estimates" | "invoices", signal?: AbortSignal) => {
    if (loadedTabs.current.has(tab)) return;
    setTabsLoading(prev => ({ ...prev, [tab]: true }));
    try {
      const urls: Record<string, string> = {
        jobs: `/api/jobs?customerId=${customerId}&_limit=50&_sort=scheduled_date&_order=desc`,
        estimates: `/api/estimates?customerId=${customerId}&_limit=50`,
        invoices: `/api/invoices?customerId=${customerId}&_limit=50`,
      };
      const res = await fetch(urls[tab], { signal });
      if (!res.ok) throw new Error(`Failed to fetch ${tab}`);
      const json = await res.json();
      const data = json.data || [];
      if (tab === "jobs") setJobs(data);
      else if (tab === "estimates") setEstimates(data);
      else setInvoices(data);
      loadedTabs.current.add(tab);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      console.error(`Error fetching ${tab}:`, error);
    } finally {
      setTabsLoading(prev => ({ ...prev, [tab]: false }));
    }
  }, [customerId]);

  const loadTabData = useCallback((tab: CustomerTab) => {
    const controller = new AbortController();
    if (tab === "jobs" || tab === "overview") fetchTab("jobs", controller.signal);
    else if (tab === "estimates") fetchTab("estimates", controller.signal);
    else if (tab === "invoices") fetchTab("invoices", controller.signal);
    return () => controller.abort();
  }, [fetchTab]);

  const refetchJobs = useCallback(() => {
    loadedTabs.current.delete("jobs");
    return fetchTab("jobs");
  }, [fetchTab]);

  const refetchEstimates = useCallback(() => {
    loadedTabs.current.delete("estimates");
    return fetchTab("estimates");
  }, [fetchTab]);

  const refetchInvoices = useCallback(() => {
    loadedTabs.current.delete("invoices");
    return fetchTab("invoices");
  }, [fetchTab]);

  return {
    jobs, estimates, invoices, tabsLoading, loadTabData,
    refetchJobs, refetchEstimates, refetchInvoices,
  };
}
