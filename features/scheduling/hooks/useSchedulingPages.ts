"use client";

import { useState, useCallback, useEffect } from "react";
import type { SchedulingPage } from "../types";

type PageListItem = Pick<SchedulingPage, "id" | "companyId" | "name" | "slug" | "publicToken" | "status" | "isActive" | "publishedAt" | "totalViews" | "totalBookings" | "createdAt" | "updatedAt">;

export function useSchedulingPages() {
  const [pages, setPages] = useState<PageListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/scheduling");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setPages(json.data || []);
    } catch {
      setError("Failed to load scheduling pages");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const create = useCallback(async (input: { name: string; slug: string }) => {
    const res = await fetch("/api/scheduling", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const json = await res.json();
    if (!res.ok) return { error: json.error || "Failed to create" };
    await refresh();
    return { success: true, data: json.data };
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    const res = await fetch(`/api/scheduling/${id}`, { method: "DELETE" });
    if (!res.ok) return { error: "Failed to delete" };
    await refresh();
    return { success: true };
  }, [refresh]);

  const publish = useCallback(async (id: string) => {
    const res = await fetch(`/api/scheduling/${id}/publish`, { method: "POST" });
    if (!res.ok) return { error: "Failed to publish" };
    await refresh();
    return { success: true };
  }, [refresh]);

  return { pages, isLoading, error, refresh, create, remove, publish };
}
