"use client";

import { useState, useEffect, useCallback } from "react";
import type { Customer } from "@/types/customer";
import type { LeadsSidebarFilter } from "../types";

interface UseLeadsOptions {
  leadStatus?: string;
  leadStatusNot?: string;
  search?: string;
  pageSize?: number;
  enabled?: boolean;
  sidebarFilter?: LeadsSidebarFilter;
  assignedTo?: string;
  source?: string;
}

export function useLeads(options: UseLeadsOptions = {}) {
  const {
    leadStatus, leadStatusNot, search, pageSize = 50,
    enabled = true, sidebarFilter, assignedTo, source,
  } = options;

  const [leads, setLeads] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("_page", "1");
      params.set("_limit", String(pageSize));
      params.set("status", "lead");

      if (leadStatus) params.set("leadStatus", leadStatus);
      if (leadStatusNot) params.set("leadStatus_ne", leadStatusNot);
      if (search) params.set("q", search);
      if (assignedTo) params.set("assignedTo", assignedTo);
      if (source) params.set("source", source);

      if (sidebarFilter) {
        switch (sidebarFilter) {
          case "accepted":
            params.set("leadStatus", "proposal");
            break;
          case "booked":
            params.set("leadStatus", "won");
            break;
          case "job-date-tbd":
            params.set("serviceDate_null", "true");
            break;
          case "unassigned":
            params.set("assignedTo_null", "true");
            break;
        }
      }

      const res = await fetch(`/api/customers?${params.toString()}`);
      if (!res.ok) throw new Error();
      const result = await res.json();
      setLeads(result.data ?? []);
      setTotal(result.total ?? 0);
    } catch {
      setLeads([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [leadStatus, leadStatusNot, search, pageSize, enabled, sidebarFilter, assignedTo, source]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  return {
    leads,
    total,
    isLoading,
    refetch: fetchLeads,
  };
}
