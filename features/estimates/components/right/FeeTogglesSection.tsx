"use client";

import type { AppliedFee } from "@/types/estimate";

interface Props {
  fees: AppliedFee[];
  isHourly: boolean;
  onToggle: (feeId: string, applied: boolean) => void;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export function FeeTogglesSection({ fees, isHourly, onToggle }: Props) {
  if (fees.length === 0) return null;

  return (
    <div className="space-y-1">
      {fees.map((fee) => (
        <div key={fee.feeId} className="flex items-center justify-between text-[13px]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={fee.applied}
              onChange={() => onToggle(fee.feeId, !fee.applied)}
              className="h-3.5 w-3.5 rounded"
            />
            <span className="text-slate-600">
              {fee.name}
              {fee.type === "percentage" && ` (${fee.rate}%)`}
            </span>
          </label>
          <span>
            {!fee.applied
              ? "\u2014"
              : isHourly && fee.type === "percentage"
                ? `${fee.rate}%`
                : fmt(fee.amount)}
          </span>
        </div>
      ))}
    </div>
  );
}
