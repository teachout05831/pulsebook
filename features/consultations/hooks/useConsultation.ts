"use client";

import { useState, useCallback } from "react";
import type { Consultation } from "../types";

export function useConsultation() {
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (input: {
    customerId?: string;
    estimateId?: string;
    title?: string;
    purpose?: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create consultation");
        return null;
      }
      setConsultation(data.data);
      return data.data;
    } catch {
      setError("Failed to create consultation");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const joinCall = useCallback(async (consultationId: string, role: "host" | "customer", publicToken?: string) => {
    try {
      const res = await fetch(`/api/consultations/${consultationId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, publicToken }),
      });
      const data = await res.json();
      if (!res.ok) return null;
      return data.data as { token: string; roomUrl: string };
    } catch {
      return null;
    }
  }, []);

  return { consultation, isLoading, error, create, joinCall };
}
