"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Job } from "@/types";

const DEBOUNCE_MS = 300;

export function useJobsList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const searchQuery = searchParams.get("q") || "";
  const statusFilter = searchParams.get("status") || "all";
  const [searchInput, setSearchInput] = useState(searchQuery);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setIsError(false);
    const params = new URLSearchParams();
    params.set("_page", String(currentPage));
    params.set("_limit", String(pageSize));
    if (searchQuery) params.set("q", searchQuery);
    if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);

    fetch(`/api/jobs?${params.toString()}`, { signal: controller.signal })
      .then((res) => { if (!res.ok) throw new Error("fetch failed"); return res.json(); })
      .then((json: { data: Job[]; total: number }) => {
        setJobs(json.data ?? []);
        setTotal(json.total ?? 0);
      })
      .catch((err) => { if (err?.name !== "AbortError") setIsError(true); })
      .finally(() => { if (!controller.signal.aborted) setIsLoading(false); });
    return () => controller.abort();
  }, [currentPage, pageSize, searchQuery, statusFilter]);

  const totalPages = Math.ceil(total / pageSize) || 1;
  const startItem = total > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, total);

  const updateParams = useCallback(
    (updates: { page?: number; pageSize?: number; q?: string; status?: string }) => {
      const params = new URLSearchParams(searchParamsRef.current.toString());
      if (updates.page !== undefined) params.set("page", String(updates.page));
      if (updates.pageSize !== undefined) params.set("pageSize", String(updates.pageSize));
      if (updates.q !== undefined) {
        if (updates.q) params.set("q", updates.q);
        else params.delete("q");
      }
      if (updates.status !== undefined) {
        if (updates.status && updates.status !== "all") params.set("status", updates.status);
        else params.delete("status");
      }
      router.push(`/jobs?${params.toString()}`);
    },
    [router]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchQuery) updateParams({ q: searchInput, page: 1 });
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput, searchQuery, updateParams]);

  useEffect(() => { setSearchInput(searchQuery); }, [searchQuery]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) updateParams({ page });
  };
  const handlePageSizeChange = (newSize: string) => {
    updateParams({ pageSize: parseInt(newSize, 10), page: 1 });
  };
  const handleStatusChange = (newStatus: string) => {
    updateParams({ status: newStatus, page: 1 });
  };
  const clearSearch = () => {
    setSearchInput("");
    updateParams({ q: "", page: 1 });
  };

  const isFiltered = searchQuery.length > 0 || statusFilter !== "all";

  return {
    jobs, isLoading, isError, total, searchInput, setSearchInput,
    isFiltered, statusFilter, currentPage, pageSize, totalPages,
    startItem, endItem, goToPage, handlePageSizeChange,
    handleStatusChange, clearSearch, router,
  };
}
