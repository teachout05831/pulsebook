"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useJobFormData } from "./useJobFormData";
import type { EstimateLineItem, EstimateResources, AppliedFee } from "@/types/estimate";
interface JobFormData {
  customerId: string; title: string; description: string; scheduledDate: string;
  scheduledTime: string; arrivalWindow: string; estimatedDuration: string;
  address: string; assignedTo: string; assignedCrewId: string; notes: string;
}

export function useJobForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCustomerId = searchParams.get("customerId");
  const fromEstimateId = searchParams.get("fromEstimate");
  const preselectedDate = searchParams.get("date");
  const { customers, isLoadingCustomers, teamMembers, estimate, isLoadingEstimate,
    recurringJobsEnabled, multiStopRoutesEnabled, crews, assignmentMode,
    arrivalWindows, recurrence, jobStops } = useJobFormData(fromEstimateId);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<JobFormData>({
    customerId: preselectedCustomerId || "", title: "", description: "",
    scheduledDate: preselectedDate || new Date().toISOString().split("T")[0],
    scheduledTime: "", arrivalWindow: "", estimatedDuration: "", address: "",
    assignedTo: "", assignedCrewId: "", notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [customFields, setCustomFields] = useState<Record<string, unknown>>({});
  const [tags, setTags] = useState<string[]>([]);
  const [estimateApplied, setEstimateApplied] = useState(false);
  const [assignType, setAssignType] = useState<"individual" | "crew">("individual");
  const [pricingData, setPricingData] = useState<{ lineItems: EstimateLineItem[]; pricingModel: string; resources: EstimateResources; taxRate: number; depositType: string | null; depositAmount: number; appliedFees: AppliedFee[] } | null>(null);

  useEffect(() => {
    if (!estimate || estimateApplied) return;
    const summary = estimate.lineItems.map((i) => `- ${i.description} (${i.quantity}x @ $${i.unitPrice})`).join("\n");
    setFormData((prev) => ({ ...prev, customerId: estimate.customerId, title: `Job from ${estimate.estimateNumber}`, description: `Services from estimate ${estimate.estimateNumber}:\n${summary}\n\nTotal: $${estimate.total.toFixed(2)}`, address: estimate.address || prev.address, notes: estimate.notes || "" }));
    const ext = estimate as unknown as Record<string, unknown>;
    setPricingData({ lineItems: estimate.lineItems || [], pricingModel: estimate.pricingModel || "flat", resources: (ext.resources as EstimateResources) || {}, taxRate: estimate.taxRate || 0, depositType: (ext.depositType as string) || null, depositAmount: (ext.depositAmount as number) || 0, appliedFees: (ext.appliedFees as AppliedFee[]) || [] });
    setEstimateApplied(true);
  }, [estimate, estimateApplied]);

  useEffect(() => {
    if (formData.customerId && customers.length > 0 && !estimate) {
      const selected = customers.find((c) => c.id === formData.customerId);
      if (selected?.address && !formData.address) setFormData((prev) => ({ ...prev, address: selected.address || "" }));
    }
  }, [formData.customerId, customers, formData.address, estimate]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  }, []);
  const handleCustomerChange = useCallback((value: string) => {
    const selected = customers.find((c) => c.id === value);
    setFormData((prev) => ({ ...prev, customerId: value, address: selected?.address || prev.address }));
    setErrors((prev) => ({ ...prev, customerId: undefined }));
  }, [customers]);
  const setAssignTypeWithReset = useCallback((type: "individual" | "crew") => {
    setAssignType(type);
    if (type === "individual") setFormData((p) => ({ ...p, assignedCrewId: "" }));
    else setFormData((p) => ({ ...p, assignedTo: "" }));
  }, []);
  const setAssignedTo = useCallback((v: string) => setFormData((p) => ({ ...p, assignedTo: v })), []);
  const setAssignedCrewId = useCallback((v: string) => setFormData((p) => ({ ...p, assignedCrewId: v })), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.customerId) newErrors.customerId = "Customer is required";
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.scheduledDate) newErrors.scheduledDate = "Scheduled date is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    const selectedCustomer = customers.find((c) => c.id === formData.customerId);
    const values = { customerId: formData.customerId, customerName: selectedCustomer?.name || "", title: formData.title, description: formData.description || null, status: "scheduled", scheduledDate: formData.scheduledDate, scheduledTime: formData.scheduledTime || null, arrivalWindow: formData.arrivalWindow || null, estimatedDuration: formData.estimatedDuration ? parseInt(formData.estimatedDuration, 10) : null, address: formData.address || null, assignedTo: formData.assignedTo || null, assignedCrewId: formData.assignedCrewId || null, notes: formData.notes || null, customFields, tags, isRecurringTemplate: recurrence.isRecurring, recurrenceConfig: recurrence.isRecurring ? recurrence.config : null, ...(pricingData ? { lineItems: pricingData.lineItems, pricingModel: pricingData.pricingModel, resources: pricingData.resources, taxRate: pricingData.taxRate, depositType: pricingData.depositType, depositAmount: pricingData.depositAmount, appliedFees: pricingData.appliedFees } : {}), ...(fromEstimateId ? { sourceEstimateId: fromEstimateId } : {}) };
    setIsCreating(true);
    try {
      const res = await fetch("/api/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      if (!res.ok) { const err = await res.json(); toast.error(err.error || "Failed to create job"); return; }
      const { data } = await res.json();
      const newJobId = data?.id;
      if (multiStopRoutesEnabled && newJobId && jobStops.stops.some((s) => s.address)) jobStops.save(newJobId);
      if (fromEstimateId && newJobId) { await fetch(`/api/estimates/${fromEstimateId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId: newJobId, status: "approved" }) }).catch(() => {}); }
      toast.success("Job created successfully"); router.push("/jobs");
    } catch { toast.error("Failed to create job"); } finally { setIsCreating(false); }
  };

  return {
    formData, errors, customFields, setCustomFields, tags, setTags,
    customers, isLoadingCustomers, teamMembers, estimate, isLoadingEstimate, isCreating,
    assignType, setAssignType: setAssignTypeWithReset, assignmentMode, crews,
    recurrence, recurringJobsEnabled, multiStopRoutesEnabled, jobStops, arrivalWindows,
    preselectedCustomerId, handleChange, handleCustomerChange,
    setAssignedTo, setAssignedCrewId, handleSubmit, handleCancel: () => router.push("/jobs"),
  };
}
