"use client";

interface TotalsData {
  subtotal: number;
  taxAmount: number;
  feesTotal: number;
  total: number;
}

interface Props {
  totals: TotalsData;
}

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export function CompactPricingTotals({ totals }: Props) {
  return (
    <div className="mt-3 pt-2 border-t space-y-1">
      <div className="flex justify-between text-[11px]">
        <span className="font-semibold">Subtotal</span>
        <span className="font-semibold">{fmt(totals.subtotal)}</span>
      </div>
      <div className="flex justify-between text-[11px]">
        <span className="text-slate-500">Sales Tax</span>
        <span>{totals.taxAmount > 0 ? fmt(totals.taxAmount) : "—"}</span>
      </div>
      {totals.feesTotal > 0 && (
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">Fees Total</span>
          <span>{fmt(totals.feesTotal)}</span>
        </div>
      )}
      <div className="border-t my-1" />
      <div className="flex justify-between text-[11px]">
        <span className="font-semibold">Estimated Total</span>
        <span className="font-semibold">{fmt(totals.total)}</span>
      </div>
    </div>
  );
}
