"use client";

import { useState, useCallback } from "react";
import type { CustomDropdowns, DropdownOption } from "@/types/company";
import type { DropdownCategory } from "../types";

export function useCustomDropdowns(initial: CustomDropdowns) {
  const [dropdowns, setDropdowns] = useState<CustomDropdowns>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(
    async (updated: CustomDropdowns) => {
      const prev = dropdowns;
      setDropdowns(updated);
      setIsSaving(true);
      setError(null);
      try {
        const res = await fetch("/api/settings/dropdowns", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
        if (!res.ok) {
          const json = await res.json();
          throw new Error(json.error || "Failed to save");
        }
      } catch (e) {
        setDropdowns(prev);
        setError(e instanceof Error ? e.message : "Failed to save");
      } finally {
        setIsSaving(false);
      }
    },
    [dropdowns]
  );

  const updateCategory = useCallback(
    (category: DropdownCategory, options: DropdownOption[]) => {
      const updated = { ...dropdowns, [category]: options };
      save(updated);
    },
    [dropdowns, save]
  );

  return { dropdowns, isSaving, error, save, updateCategory };
}
