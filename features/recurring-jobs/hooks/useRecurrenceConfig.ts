"use client";

import { useState, useCallback } from "react";
import type { RecurrenceConfig, RecurrenceFrequency } from "@/types";

const DEFAULT_CONFIG: RecurrenceConfig = {
  frequency: "weekly",
  daysOfWeek: [],
  startDate: new Date().toISOString().split("T")[0],
  endDate: null,
  occurrences: null,
};

export function useRecurrenceConfig(initial?: RecurrenceConfig | null) {
  const [isRecurring, setIsRecurring] = useState(!!initial);
  const [config, setConfig] = useState<RecurrenceConfig>(
    initial || DEFAULT_CONFIG
  );

  const updateFrequency = useCallback((frequency: RecurrenceFrequency) => {
    setConfig((prev) => ({
      ...prev,
      frequency,
      daysOfWeek: frequency === "daily" ? [] : prev.daysOfWeek,
    }));
  }, []);

  const toggleDay = useCallback((day: number) => {
    setConfig((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day].sort(),
    }));
  }, []);

  const updateField = useCallback(
    <K extends keyof RecurrenceConfig>(key: K, value: RecurrenceConfig[K]) => {
      setConfig((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const reset = useCallback(() => {
    setIsRecurring(false);
    setConfig(DEFAULT_CONFIG);
  }, []);

  return {
    isRecurring,
    setIsRecurring,
    config,
    updateFrequency,
    toggleDay,
    updateField,
    reset,
  };
}
