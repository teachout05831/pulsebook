"use client";

import { useState, useEffect, useCallback } from "react";
import { usePortalPreview } from "@/features/portal-preview/PortalPreviewContext";
import type { CustomerAccountData, UpdateAccountInput } from "../types";

export function useCustomerAccount() {
  const { apiPrefix, isPreview } = usePortalPreview();
  const [account, setAccount] = useState<CustomerAccountData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAccount = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiPrefix}/account`);
      if (!res.ok) throw new Error("Failed to fetch account");
      const json = await res.json();
      setAccount(json.data || null);
    } catch {
      setError("Failed to load account");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAccount = useCallback(async (input: UpdateAccountInput) => {
    if (isPreview) return { error: "Preview mode - editing disabled" };
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/customer/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = await res.json();
      if (!res.ok) return { error: json.error || "Failed to update" };
      await fetchAccount();
      return { success: true };
    } catch {
      return { error: "Failed to update account" };
    } finally {
      setIsSaving(false);
    }
  }, [fetchAccount]);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  return { account, isLoading, error, isSaving, updateAccount };
}
