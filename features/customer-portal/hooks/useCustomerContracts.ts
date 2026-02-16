"use client";

import { useState, useEffect } from "react";
import { usePortalPreview } from "@/features/portal-preview/PortalPreviewContext";
import type { CustomerContract } from "../types";

export function useCustomerContracts() {
  const { apiPrefix } = usePortalPreview();
  const [contracts, setContracts] = useState<CustomerContract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${apiPrefix}/contracts`);
        if (!res.ok) {
          setError("Failed to load contracts");
          return;
        }
        const json = await res.json();
        setContracts(json.data || []);
      } catch {
        setError("Failed to load contracts");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return { contracts, isLoading, error };
}
