"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { EstimateDetail } from "@/types/estimate";

export function useEstimateDetail(initial: EstimateDetail) {
  const [estimate, setEstimate] = useState<EstimateDetail>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const updateField = useCallback(
    async (fields: Record<string, unknown>) => {
      setIsSaving(true);
      try {
        const res = await fetch(`/api/estimates/${estimate.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fields),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to update");
        setEstimate((prev) => ({ ...prev, ...fields, ...json.data }));
        return { success: true };
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to update");
        return { error: "Failed to update" };
      } finally {
        setIsSaving(false);
      }
    },
    [estimate.id]
  );

  const updateStatus = useCallback(
    async (status: string) => {
      const prev = estimate.status;
      setEstimate((e) => ({ ...e, status: status as EstimateDetail["status"] }));
      const result = await updateField({ status });
      if (result.error) setEstimate((e) => ({ ...e, status: prev }));
      else toast.success(`Status updated to ${status}`);
    },
    [estimate.status, updateField]
  );

  const deleteEstimate = useCallback(async () => {
    const res = await fetch(`/api/estimates/${estimate.id}`, { method: "DELETE" });
    if (!res.ok) { toast.error("Failed to delete"); return; }
    toast.success("Estimate deleted");
    router.push("/estimates");
  }, [estimate.id, router]);

  const duplicateEstimate = useCallback(async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/estimates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: estimate.customerId, pricingModel: estimate.pricingModel,
          bindingType: estimate.bindingType, source: estimate.source,
          serviceType: estimate.serviceType, lineItems: estimate.lineItems,
          taxRate: estimate.taxRate, notes: estimate.notes, terms: estimate.terms,
          address: estimate.address, resources: estimate.resources,
          internalNotes: estimate.internalNotes, customerNotes: estimate.customerNotes,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to duplicate");
      toast.success("Estimate duplicated");
      router.push(`/estimates/${json.data.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to duplicate");
    } finally {
      setIsSaving(false);
    }
  }, [estimate, router]);

  return { estimate, isSaving, updateField, updateStatus, deleteEstimate, duplicateEstimate, setEstimate };
}
