"use client";

import { useState, useEffect } from "react";
import { usePortalPreview } from "@/features/portal-preview/PortalPreviewContext";
import type { CustomerEstimate } from "../types";

export function useCustomerEstimates() {
  const { apiPrefix } = usePortalPreview();
  const [estimates, setEstimates] = useState<CustomerEstimate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${apiPrefix}/estimates`);
        if (!res.ok) {
          setError("Failed to load estimates");
          return;
        }
        const json = await res.json();
        setEstimates(json.data || []);
      } catch {
        setError("Failed to load estimates");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return { estimates, isLoading, error };
}
