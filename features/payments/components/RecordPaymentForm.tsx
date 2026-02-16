"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateCcFee } from "../utils/calculateCcFee";
import { PAYMENT_METHOD_LABELS } from "../types";
import type { PaymentMethod } from "../types";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

interface Props {
  balanceDue: number;
  isSubmitting: boolean;
  onSubmit: (input: { amount: number; method: PaymentMethod; paymentDate: string; referenceNumber?: string; notes?: string }) => void;
}

export function RecordPaymentForm({ balanceDue, isSubmitting, onSubmit }: Props) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");

  const numAmount = parseFloat(amount) || 0;
  const ccFee = method === "card" ? calculateCcFee(numAmount) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) return;
    onSubmit({
      amount: numAmount,
      method,
      paymentDate,
      referenceNumber: referenceNumber || undefined,
      notes: notes || undefined,
    });
    setAmount("");
    setReferenceNumber("");
    setNotes("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <Label className="text-[11px] text-slate-500">Amount *</Label>
        <Input type="number" step="0.01" min="0.01" value={amount}
          onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required className="h-8 text-sm" />
        {balanceDue > 0 && (
          <button type="button" className="text-[11px] text-blue-600 hover:underline"
            onClick={() => setAmount(String(balanceDue))}>
            Pay full balance ({fmt(balanceDue)})
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-[11px] text-slate-500">Method *</Label>
          <Select value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[]).map((m) => (
                <SelectItem key={m} value={m}>{PAYMENT_METHOD_LABELS[m]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] text-slate-500">Date *</Label>
          <Input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)}
            required className="h-8 text-sm" />
        </div>
      </div>

      {ccFee && numAmount > 0 && (
        <div className="text-[11px] text-amber-600 bg-amber-50 rounded px-2 py-1.5">
          CC processing fee: {fmt(ccFee.ccFeeAmount)} ({ccFee.ccFeeRate}%)
        </div>
      )}

      <div className="space-y-1">
        <Label className="text-[11px] text-slate-500">Reference # (optional)</Label>
        <Input value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)}
          placeholder="Check #, transaction ID" className="h-8 text-sm" />
      </div>

      <div className="space-y-1">
        <Label className="text-[11px] text-slate-500">Notes (optional)</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Payment notes" rows={2} className="text-sm resize-none" />
      </div>

      <Button type="submit" disabled={isSubmitting || numAmount <= 0} className="w-full h-8 text-sm">
        {isSubmitting && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
        Record Payment
      </Button>
    </form>
  );
}
