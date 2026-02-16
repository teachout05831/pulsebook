"use client";

import { useState, useEffect } from "react";
import type { ArrivalWindow } from "@/types/company";
import { defaultArrivalWindows } from "@/types/company";

export function useArrivalWindows() {
  const [arrivalWindows, setArrivalWindows] = useState<ArrivalWindow[]>(defaultArrivalWindows);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings/arrival-windows")
      .then((res) => res.json())
      .then((json) => {
        if (json.data && json.data.length > 0) setArrivalWindows(json.data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return { arrivalWindows, isLoading };
}
