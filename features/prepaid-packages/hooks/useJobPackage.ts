"use client";

import { useState, useCallback, useEffect } from "react";
import type { CustomerPackage } from "../types";

export function useJobPackage(customerId: string) {
  const [activePackage, setActivePackage] = useState<CustomerPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActive = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/customer-packages?customerId=${customerId}&status=active`);
      const json = await res.json();
      if (res.ok && json.data?.length > 0) {
        setActivePackage(json.data[0]);
      } else {
        setActivePackage(null);
      }
    } catch {
      setActivePackage(null);
    } finally {
      setIsLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchActive();
  }, [fetchActive]);

  return { activePackage, isLoading };
}
