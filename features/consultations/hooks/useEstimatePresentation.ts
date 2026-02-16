"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { EstimateLineItem } from "@/types/estimate";

export interface PresentedEstimate {
  lineItems: EstimateLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string | null;
  companyName: string;
}

export function useEstimatePresentation(consultationId: string) {
  const [presentedEstimate, setPresentedEstimate] = useState<PresentedEstimate | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const initialLoadRef = useRef(false);
  const fetchRef = useRef<() => void>();

  const fetchEstimate = useCallback(async () => {
    try {
      const res = await fetch(`/api/consultations/${consultationId}/estimate`);
      if (!res.ok) return;
      const json = await res.json();
      if (json.data) setPresentedEstimate(json.data);
    } catch { /* silently fail */ }
  }, [consultationId]);

  fetchRef.current = fetchEstimate;

  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;

    const supabase = createClient();
    const channel = supabase
      .channel(`consultation-${consultationId}`)
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "consultations",
        filter: `id=eq.${consultationId}`,
      }, (payload) => {
        const row = payload.new as Record<string, unknown>;
        if (row.presented_estimate_id) fetchRef.current?.();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      initialLoadRef.current = false;
    };
  }, [consultationId]);

  const approve = useCallback(async () => {
    setIsApproving(true);
    try {
      const res = await fetch(`/api/consultations/${consultationId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) return { error: "Failed to approve" };
      return { success: true as const };
    } finally { setIsApproving(false); }
  }, [consultationId]);

  const reviewLater = useCallback(() => {
    setPresentedEstimate(null);
  }, []);

  return { presentedEstimate, isApproving, approve, reviewLater };
}
