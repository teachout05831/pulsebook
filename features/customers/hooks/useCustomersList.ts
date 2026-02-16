"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Customer } from "@/types";

const DEBOUNCE_MS = 300;

export function useCustomersList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const searchQuery = searchParams.get("q") || "";

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const params = new URLSearchParams();
      params.set("_page", String(currentPage));
      params.set("_limit", String(pageSize));
      if (searchQuery) params.set("q", searchQuery);
      const res = await fetch(`/api/customers?${params.toString()}`);
      if (!res.ok) throw new Error();
      const result = await res.json();
      setCustomers(result.data ?? []);
      setTotal(result.total ?? 0);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchQuery]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const totalPages = Math.ceil(total / pageSize) || 1;
  const startItem = total > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, total);

  const updateParams = useCallback(
    (updates: { page?: number; pageSize?: number; q?: string }) => {
      const params = new URLSearchParams(searchParamsRef.current.toString());
      if (updates.page !== undefined) params.set("page", String(updates.page));
      if (updates.pageSize !== undefined) params.set("pageSize", String(updates.pageSize));
      if (updates.q !== undefined) {
        if (updates.q) params.set("q", updates.q);
        else params.delete("q");
      }
      router.push(`/customers?${params.toString()}`);
    },
    [router]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchQuery) {
        updateParams({ q: searchInput, page: 1 });
      }
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

  const clearSearch = () => {
    setSearchInput("");
    updateParams({ q: "", page: 1 });
  };

  const isSearchActive = searchQuery.length > 0;

  return {
    customers, isLoading, isError, total, searchInput, setSearchInput,
    isSearchActive, currentPage, pageSize, totalPages, startItem, endItem,
    goToPage, handlePageSizeChange, clearSearch, router,
  };
}
