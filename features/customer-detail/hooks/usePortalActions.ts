"use client";

import { useState } from "react";
import { toast } from "sonner";

export function usePortalActions(customerId: string, onAccessChange?: () => void) {
  const [linkLoading, setLinkLoading] = useState(false);

  const handleCopyLink = async () => {
    setLinkLoading(true);
    try {
      const res = await fetch("/api/customer-portal/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId }),
      });
      const json = await res.json();
      if (json.error) { toast.error(json.error); return; }
      await navigator.clipboard.writeText(json.url);
      toast.success("Portal link copied to clipboard");
    } catch {
      toast.error("Failed to generate portal link");
    } finally {
      setLinkLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!confirm("Revoke this customer's portal access?")) return;
    try {
      const res = await fetch("/api/customer-portal/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId }),
      });
      const json = await res.json();
      if (json.error) { toast.error(json.error); return; }
      toast.success("Portal access revoked");
      onAccessChange?.();
    } catch {
      toast.error("Failed to revoke access");
    }
  };

  return { linkLoading, handleCopyLink, handleRevoke };
}
