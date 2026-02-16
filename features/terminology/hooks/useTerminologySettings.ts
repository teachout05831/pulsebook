"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { TerminologySettings } from "@/types/company";

export function useTerminologySettings(initial: TerminologySettings) {
  const router = useRouter();
  const [terminology, setTerminology] = useState<TerminologySettings>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const save = useCallback(async (updated: TerminologySettings) => {
    setIsSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/settings/terminology", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to save");
      }
      setTerminology(updated);
      setSaved(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  }, [router]);

  return { terminology, setTerminology, isSaving, error, saved, save };
}
