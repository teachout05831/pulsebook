"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { JobDetail } from "@/types/job";

export function useJobDetail(initial: JobDetail) {
  const [job, setJob] = useState<JobDetail>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const updateField = useCallback(
    async (fields: Record<string, unknown>) => {
      setIsSaving(true);
      try {
        const res = await fetch(`/api/jobs/${job.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fields),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to update");
        setJob((prev) => ({ ...prev, ...fields, ...json.data }));
        return { success: true };
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to update");
        return { error: "Failed to update" };
      } finally {
        setIsSaving(false);
      }
    },
    [job.id]
  );

  const updateStatus = useCallback(
    async (status: string) => {
      const prev = job.status;
      setJob((j) => ({ ...j, status: status as JobDetail["status"] }));
      const result = await updateField({ status });
      if (result.error) setJob((j) => ({ ...j, status: prev }));
      else toast.success(`Status updated to ${status}`);
    },
    [job.status, updateField]
  );

  const deleteJob = useCallback(async () => {
    const res = await fetch(`/api/jobs/${job.id}`, { method: "DELETE" });
    if (!res.ok) { toast.error("Failed to delete"); return; }
    toast.success("Job deleted");
    router.push("/jobs");
  }, [job.id, router]);

  const duplicateJob = useCallback(async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: job.customerId,
          title: `${job.title} (Copy)`,
          description: job.description,
          address: job.address,
          notes: job.notes,
          lineItems: job.lineItems,
          pricingModel: job.pricingModel,
          resources: job.resources,
          estimatedDuration: job.estimatedDuration,
          depositType: job.depositType,
          depositAmount: job.depositAmount,
          appliedFees: job.appliedFees,
          customFields: job.customFields,
          tags: job.tags,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to duplicate");
      toast.success("Job duplicated");
      router.push(`/jobs/${json.data.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to duplicate");
    } finally {
      setIsSaving(false);
    }
  }, [job, router]);

  return { job, isSaving, updateField, updateStatus, deleteJob, duplicateJob, setJob };
}
