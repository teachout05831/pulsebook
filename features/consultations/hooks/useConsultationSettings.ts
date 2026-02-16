"use client";

import { useState, useEffect, useCallback } from "react";
import type { ConsultationSettings } from "../types";

const DEFAULTS: ConsultationSettings = {
  enabled: true,
  defaultTitle: "Video Consultation",
  autoRecord: false,
  expirationHours: 48,
  showTrustSignals: true,
  showPortfolio: true,
  welcomeMessage: "",
  widgets: [],
};

export function useConsultationSettings() {
  const [settings, setSettings] = useState<ConsultationSettings>(DEFAULTS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/settings/consultations");
        const json = await res.json();
        if (json.data) setSettings(json.data);
      } catch {
        setError("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const save = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/settings/consultations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save");
      return { success: true as const };
    } catch {
      setError("Failed to save settings");
      return { error: "Failed to save" };
    } finally {
      setIsSaving(false);
    }
  }, [settings]);

  const updateSettings = useCallback((partial: Partial<ConsultationSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  return { settings, isLoading, isSaving, error, save, updateSettings };
}
