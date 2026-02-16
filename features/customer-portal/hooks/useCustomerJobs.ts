"use client";

import { useState, useEffect } from "react";
import { usePortalPreview } from "@/features/portal-preview/PortalPreviewContext";
import type { CustomerJob } from "../types";

export function useCustomerJobs() {
  const { apiPrefix } = usePortalPreview();
  const [jobs, setJobs] = useState<CustomerJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${apiPrefix}/jobs`);
        if (!res.ok) {
          setError("Failed to load jobs");
          return;
        }
        const json = await res.json();
        setJobs(json.data || []);
      } catch {
        setError("Failed to load jobs");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return { jobs, isLoading, error };
}
