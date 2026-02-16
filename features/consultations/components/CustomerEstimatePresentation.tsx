"use client";

import { Check, Clock, Loader2 } from "lucide-react";
import type { PresentedEstimate } from "../hooks/useEstimatePresentation";
import type { EstimateLineItem } from "@/types/estimate";

interface Props {
  estimate: PresentedEstimate;
  primaryColor: string;
  isApproving: boolean;
  onApprove: () => void;
  onReviewLater: () => void;
}

export function CustomerEstimatePresentation({ estimate, primaryColor, isApproving, onApprove, onReviewLater }: Props) {
  return (
    <div className="bg-gray-950 p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-220px)]">
      <div className="text-center">
        <h2 className="text-white text-lg font-semibold">Your Estimate</h2>
        <p className="text-white/40 text-sm mt-1">From {estimate.companyName}</p>
      </div>

      <div className="rounded-xl border border-white/[0.08] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left px-4 py-2.5 text-white/40 font-medium text-xs">Item</th>
              <th className="text-center px-2 py-2.5 text-white/40 font-medium text-xs w-16">Qty</th>
              <th className="text-right px-2 py-2.5 text-white/40 font-medium text-xs w-20">Price</th>
              <th className="text-right px-4 py-2.5 text-white/40 font-medium text-xs w-20">Total</th>
            </tr>
          </thead>
          <tbody>
            {(estimate.lineItems as EstimateLineItem[]).map((item, i) => (
              <tr key={item.id || i} className="border-b border-white/[0.04]">
                <td className="px-4 py-2.5 text-white/80">{item.description}</td>
                <td className="text-center px-2 py-2.5 text-white/60">{item.quantity}</td>
                <td className="text-right px-2 py-2.5 text-white/60">${item.unitPrice.toFixed(2)}</td>
                <td className="text-right px-4 py-2.5 text-white/80">${item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between text-white/40">
          <span>Subtotal</span>
          <span>${estimate.subtotal.toFixed(2)}</span>
        </div>
        {estimate.taxAmount > 0 && (
          <div className="flex justify-between text-white/40">
            <span>Tax ({estimate.taxRate}%)</span>
            <span>${estimate.taxAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-white font-semibold text-base pt-2 border-t border-white/[0.08]">
          <span>Total</span>
          <span style={{ color: primaryColor }}>${estimate.total.toFixed(2)}</span>
        </div>
      </div>

      {estimate.notes && (
        <div className="bg-white/[0.03] rounded-lg p-3 border border-white/[0.06]">
          <div className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Notes</div>
          <p className="text-white/50 text-sm">{estimate.notes}</p>
        </div>
      )}

      <div className="space-y-2 pt-2">
        <button
          onClick={onApprove}
          disabled={isApproving}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50"
          style={{ backgroundColor: primaryColor }}
        >
          {isApproving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Approve Estimate
        </button>
        <button
          onClick={onReviewLater}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs text-white/40 hover:text-white/60 transition-colors"
        >
          <Clock className="h-3.5 w-3.5" />
          I&apos;d like to review this later
        </button>
      </div>
    </div>
  );
}
