"use client";

import { useState, useCallback, useEffect } from "react";
import type { Booking } from "../types/booking";

export function useBookings(initialStatus = "all") {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [page, setPage] = useState(1);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const qs = new URLSearchParams({ status: statusFilter, page: String(page) });
      const res = await fetch(`/api/scheduling/bookings?${qs}`);
      if (res.ok) {
        const json = await res.json();
        setBookings(json.data || []);
        setTotal(json.total || 0);
      }
    } catch { /* silent */ } finally { setIsLoading(false); }
  }, [statusFilter, page]);

  useEffect(() => { refresh(); }, [refresh]);

  const updateStatus = useCallback(async (id: string, status: string, extra?: Record<string, unknown>) => {
    const res = await fetch(`/api/scheduling/bookings/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, ...extra }),
    });
    if (!res.ok) { const json = await res.json().catch(() => ({})); return { error: json.error || "Failed" }; }
    await refresh();
    return { success: true };
  }, [refresh]);

  return { bookings, total, isLoading, page, setPage, statusFilter, setStatusFilter, refresh, updateStatus };
}
