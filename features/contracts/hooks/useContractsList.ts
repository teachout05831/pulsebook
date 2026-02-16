"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { ContractListItem, ContractsStats } from "../types";

interface UseContractsListReturn {
  instances: ContractListItem[];
  stats: ContractsStats;
  total: number;
  isLoading: boolean;
  search: string;
  setSearch: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  templateFilter: string;
  setTemplateFilter: (v: string) => void;
  dateFrom: string;
  setDateFrom: (v: string) => void;
  dateTo: string;
  setDateTo: (v: string) => void;
  page: number;
  pageSize: number;
  totalPages: number;
  goToPage: (p: number) => void;
}

const EMPTY_STATS: ContractsStats = { total: 0, signed: 0, sentPending: 0, completed: 0 };

export function useContractsList(): UseContractsListReturn {
  const [instances, setInstances] = useState<ContractListItem[]>([]);
  const [stats, setStats] = useState<ContractsStats>(EMPTY_STATS);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [templateFilter, setTemplateFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 25;
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchData = useCallback(async (q: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ all: "true", _page: String(page), _limit: String(pageSize) });
      if (q) params.set("q", q);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (templateFilter !== "all") params.set("templateName", templateFilter);
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);

      const res = await fetch(`/api/contracts/instances?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setInstances(json.data || []);
      setTotal(json.total ?? 0);
      setStats(json.stats ?? EMPTY_STATS);
    } catch {
      setInstances([]);
      setTotal(0);
      setStats(EMPTY_STATS);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, statusFilter, templateFilter, dateFrom, dateTo]);

  // Debounced search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchData(search), 300);
    return () => clearTimeout(debounceRef.current);
  }, [search, fetchData]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [statusFilter, templateFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const goToPage = useCallback((p: number) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  }, [totalPages]);

  return {
    instances, stats, total, isLoading,
    search, setSearch, statusFilter, setStatusFilter,
    templateFilter, setTemplateFilter,
    dateFrom, setDateFrom, dateTo, setDateTo,
    page, pageSize, totalPages, goToPage,
  };
}
