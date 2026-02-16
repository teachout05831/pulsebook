"use client";

import { useState, useCallback } from "react";

interface SendOptions {
  pageId: string;
  publicToken: string;
  pageStatus: string;
  customerEmail: string | null;
  customerPhone: string | null;
}

export function useEstimateSend({ pageId, publicToken, pageStatus, customerEmail, customerPhone }: SendOptions) {
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);

  const getPublicUrl = useCallback(() => {
    return `${window.location.origin}/e/${publicToken}`;
  }, [publicToken]);

  const publishIfNeeded = useCallback(async () => {
    if (pageStatus !== "draft") return;
    await fetch(`/api/estimate-pages/${pageId}/publish`, {
      method: "POST",
    }).catch(() => {});
  }, [pageId, pageStatus]);

  const copyLink = useCallback(async () => {
    await publishIfNeeded();
    const url = getPublicUrl();
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [publishIfNeeded, getPublicUrl]);

  const sendEmail = useCallback(async () => {
    if (!customerEmail) return;
    setSending(true);
    await publishIfNeeded();
    await fetch(`/api/estimate-pages/${pageId}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel: "email", to: customerEmail }),
    }).catch(() => {});
    setSending(false);
  }, [pageId, customerEmail, publishIfNeeded]);

  const sendText = useCallback(async () => {
    if (!customerPhone) return;
    setSending(true);
    await publishIfNeeded();
    await fetch(`/api/estimate-pages/${pageId}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel: "sms", to: customerPhone }),
    }).catch(() => {});
    setSending(false);
  }, [pageId, customerPhone, publishIfNeeded]);

  return { copyLink, sendEmail, sendText, copied, sending, getPublicUrl };
}
