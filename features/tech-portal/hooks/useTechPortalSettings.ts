"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { TechPortalSettings } from "@/types/company";
import { defaultTechPortalSettings } from "@/types/company";

export function useTechPortalSettings() {
  const [settings, setSettings] = useState<TechPortalSettings>(
    defaultTechPortalSettings
  );
  const [allSettings, setAllSettings] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/company");
        if (!res.ok) return;
        const json = await res.json();
        const companySettings = json.data?.settings || {};
        setAllSettings(companySettings);
        if (companySettings.techPortal) {
          setSettings({ ...defaultTechPortalSettings, ...companySettings.techPortal });
        }
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const updateSetting = useCallback(
    async (key: keyof TechPortalSettings, value: boolean) => {
      const prev = settings;
      const updated = { ...settings, [key]: value };
      setSettings(updated);

      try {
        const res = await fetch("/api/company", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            settings: { ...allSettings, techPortal: updated },
          }),
        });
        if (!res.ok) throw new Error();
      } catch {
        setSettings(prev);
        toast.error("Failed to save setting");
      }
    },
    [settings, allSettings]
  );

  return { settings, updateSetting, isLoading };
}
