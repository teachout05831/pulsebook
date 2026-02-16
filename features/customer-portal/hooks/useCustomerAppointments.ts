"use client";

import { useState, useEffect } from "react";
import { usePortalPreview } from "@/features/portal-preview/PortalPreviewContext";
import type { CustomerAppointment } from "../types";

export function useCustomerAppointments() {
  const { apiPrefix } = usePortalPreview();
  const [appointments, setAppointments] = useState<CustomerAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${apiPrefix}/appointments`);
        if (!res.ok) {
          setError("Failed to load appointments");
          return;
        }
        const json = await res.json();
        setAppointments(json.data || []);
      } catch {
        setError("Failed to load appointments");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return { appointments, isLoading, error };
}
