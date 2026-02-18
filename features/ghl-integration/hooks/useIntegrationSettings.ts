"use client";

import { useState, useEffect, useCallback } from "react";
import type { GhlIntegrationSettings } from "../types";
import { DEFAULT_GHL_SETTINGS } from "../types";

export function useIntegrationSettings() {
  const [settings, setSettings] =
    useState<GhlIntegrationSettings>(DEFAULT_GHL_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/settings/integrations");
        const json = await res.json();
        if (!cancelled && json.data) setSettings(json.data);
      } catch {
        if (!cancelled) setError("Failed to load integration settings");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const save = useCallback(async (current: GhlIntegrationSettings) => {
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/settings/integrations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(current),
      });
      if (!res.ok) throw new Error("Failed to save");
      return { success: true as const };
    } catch {
      setError("Failed to save integration settings");
      return { error: "Failed to save" };
    } finally {
      setIsSaving(false);
    }
  }, []);

  const updateSettings = useCallback(
    (partial: Partial<GhlIntegrationSettings>) => {
      setSettings((prev) => ({ ...prev, ...partial }));
    },
    []
  );

  return { settings, isLoading, isSaving, error, save, updateSettings };
}
