"use client";

import { useState, useEffect } from "react";
import { usePortalPreview } from "@/features/portal-preview/PortalPreviewContext";
import type { CustomerDashboardStats } from "../types";

export function useCustomerDashboard() {
  const { apiPrefix } = usePortalPreview();
  const [stats, setStats] = useState<CustomerDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${apiPrefix}/dashboard`);
        if (!res.ok) {
          setError("Failed to load dashboard");
          return;
        }
        const json = await res.json();
        setStats(json.data);
      } catch {
        setError("Failed to load dashboard");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return { stats, isLoading, error };
}
