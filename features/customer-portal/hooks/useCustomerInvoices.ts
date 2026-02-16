"use client";

import { useState, useEffect, useCallback } from "react";
import { usePortalPreview } from "@/features/portal-preview/PortalPreviewContext";
import type { CustomerInvoice } from "../types";

export function useCustomerInvoices() {
  const { apiPrefix } = usePortalPreview();
  const [invoices, setInvoices] = useState<CustomerInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiPrefix}/invoices`);
      if (!res.ok) throw new Error("Failed to fetch invoices");
      const json = await res.json();
      setInvoices(json.data || []);
    } catch {
      setError("Failed to load invoices");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return { invoices, isLoading, error, refresh: fetchInvoices };
}
