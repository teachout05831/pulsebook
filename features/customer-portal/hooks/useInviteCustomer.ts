"use client";

import { useState } from "react";
import { toast } from "sonner";

export function useInviteCustomer(customerId: string, onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);

  const handleInvite = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/customer-portal/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId }),
      });
      const json = await res.json();
      if (json.error) { toast.error(json.error); return; }
      setTempPassword(json.tempPassword);
      toast.success("Portal access enabled");
      onSuccess?.();
    } catch {
      toast.error("Failed to enable portal access");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!tempPassword) return;
    await navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      setLinkCopied(true);
      toast.success("Portal link copied to clipboard");
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      toast.error("Failed to generate portal link");
    } finally {
      setLinkLoading(false);
    }
  };

  const reset = () => {
    setTempPassword(null);
    setCopied(false);
    setLinkCopied(false);
  };

  return {
    isLoading, tempPassword, copied, linkCopied, linkLoading,
    handleInvite, handleCopy, handleCopyLink, reset,
  };
}
