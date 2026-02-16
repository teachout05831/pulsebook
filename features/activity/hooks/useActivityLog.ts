"use client";

import { useState, useCallback, useEffect } from "react";
import type { ActivityEntry } from "../types";

export function useActivityLog(open: boolean, entityType?: string, entityId?: string) {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!entityType || !entityId) return;
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ entityType, entityId });
      const res = await fetch(`/api/activity?${params}`);
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Failed to load");
      }
      const json = await res.json();
      setEntries(json.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load activity");
    } finally {
      setIsLoading(false);
    }
  }, [entityType, entityId]);

  useEffect(() => {
    if (open) refresh();
  }, [open, refresh]);

  return { entries, isLoading, error, refresh };
}
