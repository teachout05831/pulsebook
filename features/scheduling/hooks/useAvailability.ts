"use client";

import { useState, useCallback } from "react";
import type { TimeSlot } from "../types/booking";
import type { CapacityStatus } from "../utils/capacity";

interface AvailabilityData {
  date: string;
  slots: TimeSlot[];
  capacity: { total: number; used: number; remaining: number; status: CapacityStatus };
}

export function useAvailability() {
  const [data, setData] = useState<AvailabilityData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSlots = useCallback(async (date: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/scheduling/availability?date=${date}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        const json = await res.json().catch(() => ({}));
        setError(json.error || "Failed to load availability");
      }
    } catch {
      setError("Network error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, fetchSlots };
}
