"use client";

import { useState, useEffect, useCallback } from "react";
import type { PrebuiltFieldSettings } from "@/types";

const DEFAULT_SETTINGS: PrebuiltFieldSettings = {
  recurringJobs: false,
  multiStopRoutes: false,
};

export function usePrebuiltFields() {
  const [settings, setSettings] = useState<PrebuiltFieldSettings>(DEFAULT_SETTINGS);
  const [allSettings, setAllSettings] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/company", { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      const companySettings = json.data?.settings || {};
      setAllSettings(companySettings);
      setSettings(companySettings.prebuiltFields || DEFAULT_SETTINGS);
    } catch {
      // Silently fail - defaults are safe
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = useCallback(
    async (field: keyof PrebuiltFieldSettings, value: boolean) => {
      const updated = { ...settings, [field]: value };
      setSettings(updated);

      try {
        const res = await fetch("/api/company", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            settings: { ...allSettings, prebuiltFields: updated },
          }),
        });
        if (!res.ok) {
          setSettings(settings); // Revert on failure
        } else {
          const json = await res.json();
          const newSettings = json.data?.settings || {};
          setAllSettings(newSettings);
        }
      } catch {
        setSettings(settings); // Revert on failure
      }
    },
    [settings, allSettings]
  );

  return {
    recurringJobsEnabled: settings.recurringJobs,
    multiStopRoutesEnabled: settings.multiStopRoutes,
    toggle,
    isLoading,
  };
}
