"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Consultation } from "../types";

type ListItem = Pick<
  Consultation,
  "id" | "title" | "purpose" | "status" | "pipelineStatus" | "customerName" | "hostName" | "durationSeconds" | "scheduledAt" | "createdAt" | "estimateId" | "publicToken"
>;

export function useConsultationsList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 20;
  const statusFilter = searchParams.get("status") || "all";

  const [consultations, setConsultations] = useState<ListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    const params = new URLSearchParams();
    params.set("_page", String(currentPage));
    params.set("_limit", String(pageSize));
    if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);

    fetch(`/api/consultations?${params.toString()}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("fetch failed");
        return res.json();
      })
      .then((json: { data: ListItem[]; total: number }) => {
        setConsultations(json.data ?? []);
        setTotal(json.total ?? 0);
      })
      .catch((err) => {
        if (err?.name !== "AbortError") setConsultations([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [currentPage, statusFilter, refreshKey]);

  const totalPages = Math.ceil(total / pageSize) || 1;

  const updateParams = useCallback(
    (updates: { page?: number; status?: string }) => {
      const params = new URLSearchParams(searchParamsRef.current.toString());
      if (updates.page !== undefined) params.set("page", String(updates.page));
      if (updates.status !== undefined) {
        if (updates.status && updates.status !== "all") params.set("status", updates.status);
        else params.delete("status");
      }
      router.push(`/consultations?${params.toString()}`);
    },
    [router]
  );

  const goToPage = (page: number) => { if (page >= 1 && page <= totalPages) updateParams({ page }); };
  const handleStatusChange = (newStatus: string) => updateParams({ status: newStatus, page: 1 });
  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const patchConsultation = useCallback(async (id: string, body: Record<string, unknown>) => {
    const res = await fetch(`/api/consultations/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    if (res.ok) refresh();
    return res.ok;
  }, [refresh]);

  const handleDelete = useCallback(async (id: string) => {
    const res = await fetch(`/api/consultations/${id}`, { method: "DELETE" });
    if (res.ok) refresh();
    return res.ok;
  }, [refresh]);

  const handleCancel = useCallback((id: string) => patchConsultation(id, { status: "cancelled" }), [patchConsultation]);
  const handleReschedule = useCallback((id: string, scheduledAt: string) => patchConsultation(id, { status: "pending", scheduledAt }), [patchConsultation]);

  return {
    consultations, total, isLoading, statusFilter,
    currentPage, pageSize, totalPages, goToPage, handleStatusChange,
    refresh, handleDelete, handleCancel, handleReschedule, patchConsultation,
  };
}
