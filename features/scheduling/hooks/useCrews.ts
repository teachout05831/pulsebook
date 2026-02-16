"use client";

import { useState, useCallback, useEffect } from "react";
import type { Crew } from "../types";

export function useCrews() {
  const [crews, setCrews] = useState<Crew[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/scheduling/crews");
      if (res.ok) { const json = await res.json(); setCrews(json.data || []); }
    } catch { /* silent */ } finally { setIsLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const createCrew = useCallback(async (input: Partial<Crew>) => {
    const res = await fetch("/api/scheduling/crews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
    const json = await res.json();
    if (!res.ok) return { error: json.error || "Failed" };
    await refresh();
    return { success: true, data: json.data };
  }, [refresh]);

  const updateCrew = useCallback(async (id: string, input: Partial<Crew>) => {
    const res = await fetch(`/api/scheduling/crews/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
    const json = await res.json();
    if (!res.ok) return { error: json.error || "Failed" };
    await refresh();
    return { success: true, data: json.data };
  }, [refresh]);

  const deleteCrew = useCallback(async (id: string) => {
    const res = await fetch(`/api/scheduling/crews/${id}`, { method: "DELETE" });
    if (!res.ok) return { error: "Failed to delete" };
    await refresh();
    return { success: true };
  }, [refresh]);

  return { crews, isLoading, refresh, createCrew, updateCrew, deleteCrew };
}
