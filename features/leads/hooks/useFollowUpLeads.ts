"use client";

import { useState, useEffect, useCallback } from "react";
import type { Customer } from "@/types/customer";
import type { FollowUpsSidebarFilter } from "../types";

interface UseFollowUpLeadsOptions {
  filter?: FollowUpsSidebarFilter;
  search?: string;
  assignedTo?: string;
}

export function useFollowUpLeads(options: UseFollowUpLeadsOptions = {}) {
  const { filter = "open", search, assignedTo } = options;
  const [leads, setLeads] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("filter", filter);
      if (search) params.set("q", search);
      if (assignedTo) params.set("assignedTo", assignedTo);

      const res = await fetch(`/api/follow-ups/leads?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setLeads(json.data || []);
      setTotal(json.total || 0);
    } catch {
      setLeads([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [filter, search, assignedTo]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return { leads, total, isLoading, refetch: fetchLeads };
}
