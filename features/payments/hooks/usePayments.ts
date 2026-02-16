"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import type { Payment, RecordPaymentInput } from "../types";

interface Props {
  entityType: "estimate" | "job";
  entityId: string;
  onPaymentChange?: (newDepositPaid: number) => void;
}

export function usePayments({ entityType, entityId, onPaymentChange }: Props) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  const param = entityType === "estimate" ? "estimateId" : "jobId";

  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/payments?${param}=${entityId}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load payments");
      setPayments(json.data || []);
    } catch {
      toast.error("Failed to load payments");
    } finally {
      setIsLoading(false);
    }
  }, [param, entityId]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const recordPayment = useCallback(async (input: Omit<RecordPaymentInput, "entityType" | "entityId">) => {
    setIsRecording(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, entityType, entityId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to record payment");
      setPayments((prev) => [json.data.payment, ...prev]);
      onPaymentChange?.(json.data.newDepositPaid);
      toast.success("Payment recorded");
      return { success: true };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to record payment";
      toast.error(msg);
      return { error: msg };
    } finally {
      setIsRecording(false);
    }
  }, [entityType, entityId, onPaymentChange]);

  const voidPayment = useCallback(async (paymentId: string) => {
    try {
      const res = await fetch(`/api/payments/${paymentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "voided" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to void payment");
      setPayments((prev) => prev.map((p) => (p.id === paymentId ? { ...p, status: "voided" as const } : p)));
      onPaymentChange?.(json.data.newDepositPaid);
      toast.success("Payment voided");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to void payment");
    }
  }, [onPaymentChange]);

  const totalPaid = payments.filter((p) => p.status === "completed").reduce((s, p) => s + p.amount, 0);

  return { payments, isLoading, isRecording, recordPayment, voidPayment, totalPaid };
}
