"use client";

import { useState, useEffect, useCallback } from "react";
import { usePortalPreview } from "@/features/portal-preview/PortalPreviewContext";
import type { CustomerJobDetail } from "../types";

export function useCustomerJobDetail(jobId: string) {
  const { apiPrefix, isPreview } = usePortalPreview();
  const [job, setJob] = useState<CustomerJobDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiPrefix}/jobs/${jobId}`);
      if (!res.ok) {
        setError("Failed to load job");
        return;
      }
      const json = await res.json();
      setJob(json.data);
    } catch {
      setError("Failed to load job");
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    load();
  }, [load]);

  const uploadPhoto = useCallback(
    async (file: File) => {
      if (isPreview) return { error: "Preview mode - uploads disabled" };
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`/api/customer/jobs/${jobId}/photos`, {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) return { error: json.error || "Upload failed" };
      await load();
      return { success: true, url: json.data?.url };
    },
    [jobId, load]
  );

  return { job, isLoading, error, refresh: load, uploadPhoto };
}
