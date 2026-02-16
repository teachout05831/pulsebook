"use client";

import { useState, useCallback, useEffect } from "react";
import type { SchedulingConfig, UpdateSchedulingConfigInput } from "../types";

export function useSchedulingConfig() {
  const [config, setConfig] = useState<SchedulingConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/scheduling/config");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setConfig(json.data || null);
    } catch {
      setError("Failed to load scheduling config");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const updateConfig = useCallback(async (input: UpdateSchedulingConfigInput) => {
    const res = await fetch("/api/scheduling/config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const json = await res.json();
    if (!res.ok) return { error: json.error || "Failed to update" };
    setConfig(json.data);
    return { success: true, data: json.data };
  }, []);

  return { config, isLoading, error, refresh, updateConfig };
}
