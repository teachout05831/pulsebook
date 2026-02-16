"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";
import { usePayments } from "../hooks/usePayments";
import { PaymentHistory } from "./PaymentHistory";
import { RecordPaymentForm } from "./RecordPaymentForm";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

interface Props {
  open: boolean;
  onClose: () => void;
  entityType: "estimate" | "job";
  entityId: string;
  total: number;
  depositPaid: number;
  onPaymentChange: (newDepositPaid: number) => void;
}

export function PaymentsPanel({ open, onClose, entityType, entityId, total, depositPaid, onPaymentChange }: Props) {
  const { payments, isLoading, isRecording, recordPayment, voidPayment, totalPaid } = usePayments({
    entityType,
    entityId,
    onPaymentChange,
  });

  const paid = Math.max(depositPaid, totalPaid);
  const balance = Math.max(0, total - paid);

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="p-0 w-[380px] sm:max-w-[380px] flex flex-col">
        <div className="bg-slate-800 text-white px-5 py-4 sticky top-0 z-10">
          <SheetHeader>
            <SheetTitle className="text-white font-semibold text-base">Payments</SheetTitle>
            <SheetDescription className="sr-only">Record and view payments</SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Total</div>
              <div className="text-[15px] font-bold text-slate-700">{fmt(total)}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] font-semibold text-green-500 uppercase tracking-wide">Paid</div>
              <div className="text-[15px] font-bold text-green-600">{fmt(paid)}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Balance</div>
              <div className={`text-[15px] font-bold ${balance > 0 ? "text-red-600" : "text-slate-700"}`}>{fmt(balance)}</div>
            </div>
          </div>

          {/* Payment History */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">History</p>
            {isLoading ? (
              <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-slate-400" /></div>
            ) : (
              <PaymentHistory payments={payments} onVoid={voidPayment} />
            )}
          </div>

          {/* Record Payment Form */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Record Payment</p>
            <RecordPaymentForm balanceDue={balance} isSubmitting={isRecording} onSubmit={recordPayment} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
