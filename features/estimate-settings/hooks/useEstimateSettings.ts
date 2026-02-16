"use client";

import { useState, useCallback } from "react";
import type { EstimateBuilderSettings } from "@/types/company";

export function useEstimateSettings(initial: EstimateBuilderSettings) {
  const [settings, setSettings] = useState<EstimateBuilderSettings>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(
    async (updated: EstimateBuilderSettings) => {
      const prev = settings;
      setSettings(updated);
      setIsSaving(true);
      setError(null);
      try {
        const res = await fetch("/api/settings/estimate-builder", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
        if (!res.ok) {
          const json = await res.json();
          throw new Error(json.error || "Failed to save");
        }
      } catch (e) {
        setSettings(prev);
        setError(e instanceof Error ? e.message : "Failed to save");
      } finally {
        setIsSaving(false);
      }
    },
    [settings]
  );

  const updateField = useCallback(
    <K extends keyof EstimateBuilderSettings>(key: K, value: EstimateBuilderSettings[K]) => {
      const updated = { ...settings, [key]: value };
      save(updated);
    },
    [settings, save]
  );

  return { settings, isSaving, error, save, updateField };
}
