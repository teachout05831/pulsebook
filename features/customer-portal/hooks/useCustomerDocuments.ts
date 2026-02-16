"use client";

import { useState, useEffect, useCallback } from "react";
import { usePortalPreview } from "@/features/portal-preview/PortalPreviewContext";
import type { CustomerDocument } from "../types";

export function useCustomerDocuments() {
  const { apiPrefix } = usePortalPreview();
  const [documents, setDocuments] = useState<CustomerDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiPrefix}/documents`);
      if (!res.ok) throw new Error("Failed to fetch documents");
      const json = await res.json();
      setDocuments(json.data || []);
    } catch {
      setError("Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return { documents, isLoading, error, refresh: fetchDocuments };
}
