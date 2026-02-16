"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PAYMENT_METHOD_LABELS } from "../types";
import type { Payment } from "../types";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

interface Props {
  payments: Payment[];
  onVoid: (id: string) => void;
}

export function PaymentHistory({ payments, onVoid }: Props) {
  if (payments.length === 0) {
    return <p className="text-[13px] text-slate-400 py-3">No payments recorded yet</p>;
  }

  return (
    <div className="space-y-1">
      {payments.map((p) => {
        const isVoided = p.status === "voided";
        return (
          <div key={p.id} className={`flex items-center justify-between py-2 border-b border-slate-100 group ${isVoided ? "opacity-50" : ""}`}>
            <div className="flex-1 min-w-0">
              <div className={`text-[13px] font-medium ${isVoided ? "line-through" : ""}`}>
                {fmt(p.amount)}
                <span className="text-slate-400 font-normal ml-2">{PAYMENT_METHOD_LABELS[p.method]}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                {new Date(p.paymentDate).toLocaleDateString()}
                {p.referenceNumber && <span className="ml-2">Ref: {p.referenceNumber}</span>}
                {p.receivedBy && <span className="ml-2">by {p.receivedBy}</span>}
              </div>
              {p.ccFeeAmount > 0 && (
                <div className="text-[10px] text-slate-400">CC fee: {fmt(p.ccFeeAmount)} ({p.ccFeeRate}%)</div>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              {isVoided ? (
                <Badge variant="secondary" className="text-[10px] bg-red-50 text-red-600">Voided</Badge>
              ) : (
                <Button variant="ghost" size="sm" className="h-5 text-[10px] text-red-500 opacity-0 group-hover:opacity-100"
                  onClick={() => onVoid(p.id)}>Void</Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
