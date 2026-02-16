"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ArrivalWindow } from "@/types/company";

export function useArrivalWindowsSettings(initialWindows: ArrivalWindow[]) {
  const router = useRouter();
  const [windows, setWindows] = useState<ArrivalWindow[]>(initialWindows);
  const [isSaving, setIsSaving] = useState(false);

  const addWindow = useCallback(() => {
    const id = `window_${Date.now()}`;
    setWindows((prev) => [...prev, { id, label: "", startTime: "08:00", endTime: "12:00" }]);
  }, []);

  const updateWindow = useCallback((id: string, field: keyof ArrivalWindow, value: string | boolean) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, [field]: value } : w)));
  }, []);

  const removeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const save = useCallback(async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings/arrival-windows", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(windows),
      });
      const json = await res.json();
      if (json.error) {
        toast.error(json.error);
      } else {
        toast.success("Arrival windows saved");
        router.refresh();
      }
    } catch {
      toast.error("Failed to save arrival windows");
    } finally {
      setIsSaving(false);
    }
  }, [windows, router]);

  const reset = useCallback(() => {
    setWindows(initialWindows);
  }, [initialWindows]);

  return { windows, isSaving, addWindow, updateWindow, removeWindow, save, reset };
}
