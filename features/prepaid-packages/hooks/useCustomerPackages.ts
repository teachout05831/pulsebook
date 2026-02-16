"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import type { CustomerPackage, PurchasePackageInput } from "../types";

interface Props {
  customerId: string;
}

export function useCustomerPackages({ customerId }: Props) {
  const [packages, setPackages] = useState<CustomerPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const fetchPackages = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/customer-packages?customerId=${customerId}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load");
      setPackages(json.data || []);
    } catch {
      toast.error("Failed to load packages");
    } finally {
      setIsLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const activePackage = useMemo(
    () => packages.find((p) => p.status === "active") || null,
    [packages]
  );

  const purchasePackage = useCallback(
    async (input: PurchasePackageInput) => {
      setIsPurchasing(true);
      try {
        const res = await fetch("/api/customer-packages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to purchase");
        await fetchPackages();
        toast.success("Package purchased");
        return { success: true };
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to purchase";
        toast.error(msg);
        return { error: msg };
      } finally {
        setIsPurchasing(false);
      }
    },
    [fetchPackages]
  );

  const cancelPackage = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/customer-packages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (!res.ok) {
        toast.error("Failed to cancel package");
        return { error: "Failed to cancel" };
      }
      await fetchPackages();
      toast.success("Package cancelled");
      return { success: true };
    },
    [fetchPackages]
  );

  return { packages, activePackage, isLoading, isPurchasing, purchasePackage, cancelPackage };
}
