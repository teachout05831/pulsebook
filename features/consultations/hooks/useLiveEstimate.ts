"use client";

import { useState, useEffect, useCallback } from "react";
import { calculateTotals } from "@/features/estimates/utils/calculateTotals";
import type { EstimateLineItem, EstimateResources } from "@/types/estimate";

interface CatalogItem { id: string; name: string; defaultPrice?: number; unitPrice?: number; category: string; unitLabel?: string }

export function useLiveEstimate(consultationId: string, customerId: string | null) {
  const [services, setServices] = useState<CatalogItem[]>([]);
  const [materials, setMaterials] = useState<CatalogItem[]>([]);
  const [lineItems, setLineItems] = useState<EstimateLineItem[]>([]);
  const [resources, setResources] = useState<EstimateResources>({ trucks: null, teamSize: null, estimatedHours: null, hourlyRate: null, showEstimatedHours: false, minHours: null, maxHours: null, customFields: {} });
  const [notes, setNotes] = useState("");
  const [savedEstimateId, setSavedEstimateId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/service-catalog").then(r => r.ok ? r.json() : { data: [] }).then(j => setServices(j.data || [])).catch(() => {});
    fetch("/api/materials-catalog").then(r => r.ok ? r.json() : { data: [] }).then(j => setMaterials(j.data || [])).catch(() => {});
  }, []);

  const totals = calculateTotals({ lineItems, resources, pricingModel: "flat", taxRate: 0, depositType: null, depositValue: 0, depositPaid: 0 });

  const addFromCatalog = useCallback((item: CatalogItem, type: "service" | "material") => {
    const newItem: EstimateLineItem = {
      id: crypto.randomUUID(),
      description: item.name,
      quantity: 1,
      unitPrice: item.defaultPrice ?? item.unitPrice ?? 0,
      total: item.defaultPrice ?? item.unitPrice ?? 0,
      category: type === "service" ? "primary_service" : "materials",
      catalogItemId: item.id,
      catalogType: type,
      unitLabel: item.unitLabel || null,
      isTaxable: true,
    };
    setLineItems(prev => [...prev, newItem]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setLineItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<EstimateLineItem>) => {
    setLineItems(prev => prev.map(i => {
      if (i.id !== id) return i;
      const updated = { ...i, ...updates };
      updated.total = updated.quantity * updated.unitPrice;
      return updated;
    }));
  }, []);

  const saveEstimate = useCallback(async () => {
    setIsSaving(true);
    try {
      const body = { customerId, lineItems, resources, notes, pricingModel: "flat", source: "consultation" };
      if (savedEstimateId) {
        const res = await fetch(`/api/estimates/${savedEstimateId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) return { error: "Failed to update" };
        return { success: true as const, estimateId: savedEstimateId };
      }
      const res = await fetch("/api/estimates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const json = await res.json();
      if (!res.ok) return { error: json.error || "Failed to create" };
      setSavedEstimateId(json.data?.id);
      return { success: true as const, estimateId: json.data?.id };
    } finally { setIsSaving(false); }
  }, [customerId, lineItems, resources, notes, savedEstimateId]);

  const presentToCustomer = useCallback(async (estimateId: string) => {
    const res = await fetch(`/api/consultations/${consultationId}/present`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ estimateId }) });
    if (!res.ok) return { error: "Failed to present" };
    return { success: true as const };
  }, [consultationId]);

  return { services, materials, lineItems, resources, notes, totals, savedEstimateId, isSaving, addFromCatalog, removeItem, updateItem, setResources, setNotes, saveEstimate, presentToCustomer };
}
