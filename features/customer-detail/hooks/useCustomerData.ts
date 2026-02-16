"use client";

import { useState, useEffect, useCallback } from "react";
import type { Customer } from "@/types";

export function useCustomerData(customerId: string) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchCustomer = useCallback(async (signal?: AbortSignal) => {
    try {
      const res = await fetch(`/api/customers/${customerId}`, { signal });
      if (!res.ok) throw new Error("Failed to fetch customer");
      const json = await res.json();
      setCustomer(json.data);
      return true;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return false;
      console.error("Error fetching customer:", error);
      setIsError(true);
      return false;
    }
  }, [customerId]);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setIsError(false);
    fetchCustomer(controller.signal).then(() => {
      if (!controller.signal.aborted) setIsLoading(false);
    });
    return () => controller.abort();
  }, [fetchCustomer]);

  const refetchCustomer = useCallback(() => fetchCustomer(), [fetchCustomer]);

  return { customer, isLoading, isError, refetchCustomer };
}
