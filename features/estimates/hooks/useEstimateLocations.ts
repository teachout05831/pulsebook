"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { EstimateLocation } from "@/types/estimate";

export function useEstimateLocations(estimateId: string, initial: EstimateLocation[]) {
  const [locations, setLocations] = useState<EstimateLocation[]>(initial);

  const addLocation = useCallback(
    async (data: Partial<EstimateLocation>) => {
      const res = await fetch(`/api/estimates/${estimateId}/locations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) { toast.error(json.error || "Failed to add"); return { error: json.error }; }
      setLocations((prev) => [...prev, json.data]);
      return { success: true };
    },
    [estimateId]
  );

  const updateLocation = useCallback(
    async (locId: string, data: Partial<EstimateLocation>) => {
      const res = await fetch(`/api/estimates/${estimateId}/locations/${locId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) { toast.error(json.error || "Failed to update"); return { error: json.error }; }
      setLocations((prev) => prev.map((l) => (l.id === locId ? { ...l, ...json.data } : l)));
      return { success: true };
    },
    [estimateId]
  );

  const removeLocation = useCallback(
    async (locId: string) => {
      const prev = locations;
      setLocations((p) => p.filter((l) => l.id !== locId));
      const res = await fetch(`/api/estimates/${estimateId}/locations/${locId}`, { method: "DELETE" });
      if (!res.ok) { setLocations(prev); toast.error("Failed to delete"); }
    },
    [estimateId, locations]
  );

  return { locations, addLocation, updateLocation, removeLocation };
}
