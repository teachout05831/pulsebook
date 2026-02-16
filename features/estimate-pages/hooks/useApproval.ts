"use client";

import { useState, useCallback, useRef } from "react";

interface UseApprovalProps {
  pageId: string;
  initialStatus: string;
}

interface ActionResult {
  success: boolean;
  error?: string;
}

export function useApproval({ pageId, initialStatus }: UseApprovalProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const postAction = useCallback(
    async (action: string, body?: Record<string, unknown>): Promise<ActionResult> => {
      if (submittingRef.current) return { success: false, error: "Already submitting" };
      submittingRef.current = true;
      setIsSubmitting(true);
      try {
        const res = await fetch(`/api/estimate-pages/${pageId}/${action}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: body ? JSON.stringify(body) : undefined,
        });

        const data = await res.json();

        if (!res.ok) {
          return { success: false, error: data.error || "Request failed" };
        }

        return { success: true };
      } catch {
        return { success: false, error: "Network error. Please try again." };
      } finally {
        submittingRef.current = false;
        setIsSubmitting(false);
      }
    },
    [pageId]
  );

  const approve = useCallback(async (selectedPackage?: { name: string; price: number }): Promise<ActionResult> => {
    const result = await postAction("approve", selectedPackage ? { selectedPackage } : undefined);
    if (result.success) setStatus("approved");
    return result;
  }, [postAction]);

  const decline = useCallback(
    async (reason?: string): Promise<ActionResult> => {
      const result = await postAction("decline", reason ? { reason } : {});
      if (result.success) setStatus("declined");
      return result;
    },
    [postAction]
  );

  const requestChanges = useCallback(
    async (message: string): Promise<ActionResult> => {
      const result = await postAction("request-changes", { message });
      return result;
    },
    [postAction]
  );

  return { status, isSubmitting, approve, decline, requestChanges };
}
