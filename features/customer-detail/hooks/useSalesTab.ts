"use client";

import { useState, useEffect, useCallback } from "react";
import type { LeadStatus } from "@/types/customer";
import { getFollowUpUrgency, getDaysOverdue } from "@/features/follow-ups/types";
import type { FollowUpUrgency } from "@/features/follow-ups/types";

export interface SalesFollowUp {
  id: string;
  customerId: string;
  type: "call" | "email" | "meeting";
  details: string | null;
  dueDate: string;
  status: string;
  urgency: FollowUpUrgency;
  daysOverdue: number;
}

export function useSalesTab(customerId: string) {
  const [followUps, setFollowUps] = useState<SalesFollowUp[]>([]);
  const [isLoadingFollowUps, setIsLoadingFollowUps] = useState(true);

  const refreshFollowUps = useCallback(async () => {
    setIsLoadingFollowUps(true);
    try {
      const res = await fetch(`/api/customers/${customerId}/follow-ups`);
      if (!res.ok) throw new Error("Failed to fetch follow-ups");
      const json = await res.json();
      const pending = (json.data || []).filter(
        (f: { status: string }) => f.status === "pending"
      );
      const enriched: SalesFollowUp[] = pending.map(
        (f: { id: string; customerId: string; type: "call" | "email" | "meeting"; details: string | null; dueDate: string; status: string }) => ({
          ...f,
          urgency: getFollowUpUrgency(new Date(f.dueDate)),
          daysOverdue: getDaysOverdue(new Date(f.dueDate)),
        })
      );
      setFollowUps(enriched);
    } catch {
      setFollowUps([]);
    } finally {
      setIsLoadingFollowUps(false);
    }
  }, [customerId]);

  useEffect(() => {
    refreshFollowUps();
  }, [refreshFollowUps]);

  const handleStageChange = useCallback(
    async (newStatus: LeadStatus) => {
      const res = await fetch(`/api/customers/${customerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadStatus: newStatus }),
      });
      return res.ok;
    },
    [customerId]
  );

  const handleSourceChange = useCallback(
    async (newSource: string) => {
      const res = await fetch(`/api/customers/${customerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: newSource }),
      });
      return res.ok;
    },
    [customerId]
  );

  const handleCompleteFollowUp = useCallback(
    async (followUpId: string) => {
      const res = await fetch(`/api/follow-ups/${followUpId}/complete`, {
        method: "POST",
      });
      if (res.ok) await refreshFollowUps();
      return res.ok;
    },
    [refreshFollowUps]
  );

  return {
    followUps,
    isLoadingFollowUps,
    handleStageChange,
    handleSourceChange,
    handleCompleteFollowUp,
    refreshFollowUps,
  };
}
