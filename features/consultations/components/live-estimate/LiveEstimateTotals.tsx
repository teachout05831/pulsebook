"use client";

interface Props {
  subtotal: number;
  taxAmount: number;
  total: number;
  primaryColor: string;
}

export function LiveEstimateTotals({ subtotal, taxAmount, total, primaryColor }: Props) {
  return (
    <div className="border-t border-white/[0.06] pt-3 space-y-1">
      <div className="flex justify-between text-xs text-white/40">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      {taxAmount > 0 && (
        <div className="flex justify-between text-xs text-white/40">
          <span>Tax</span>
          <span>${taxAmount.toFixed(2)}</span>
        </div>
      )}
      <div className="flex justify-between text-sm font-semibold pt-1">
        <span className="text-white">Total</span>
        <span style={{ color: primaryColor }}>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
