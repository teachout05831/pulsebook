"use client";

import { useState, useCallback, useEffect } from "react";
import type { DocumentItem } from "../types";

export function useDocuments(open: boolean, estimateId?: string, jobId?: string) {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!estimateId && !jobId) return;
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (estimateId) params.set("estimateId", estimateId);
      if (jobId) params.set("jobId", jobId);
      const res = await fetch(`/api/documents?${params}`);
      if (!res.ok) { const json = await res.json().catch(() => ({})); throw new Error(json.error || "Failed to load"); }
      const json = await res.json();
      setDocuments(json.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  }, [estimateId, jobId]);

  useEffect(() => {
    if (open) refresh();
  }, [open, refresh]);

  return { documents, isLoading, error, refresh };
}
