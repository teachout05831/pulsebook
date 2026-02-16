"use client";

interface ActiveTierInfo {
  label: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  message: string;
}

interface HourlyResources {
  hourlyRate: number | null;
  teamSize: number | null;
  estimatedHours: number | null;
  showEstimatedHours?: boolean;
  minHours?: number | null;
  maxHours?: number | null;
}

interface LineItem { unitPrice: number; category?: string }

interface PricingTotalBlockProps {
  estimate: { total: number; subtotal: number; taxRate: number; taxAmount: number };
  pricingModel?: string;
  resources?: HourlyResources;
  lineItems?: LineItem[];
  activeTier?: ActiveTierInfo | null;
  discountedTotal?: number;
  savingsAmount?: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

function HourlySubtitle({ resources, rate }: { resources: HourlyResources; rate: number }) {
  const team = resources.teamSize || 1;
  const minH = resources.minHours ?? resources.estimatedHours;
  const maxH = resources.maxHours;
  if (!rate || !minH) return null;

  const hasRange = minH != null && maxH != null && minH > 0 && maxH > 0 && minH !== maxH;
  const base = team > 1 ? `${fmt(rate)}/hr × ${team} crew` : `${fmt(rate)}/hr`;

  if (hasRange) {
    const minTotal = minH * rate * team;
    const maxTotal = maxH * rate * team;
    return (
      <div className="text-sm text-gray-500 px-4 mt-1">
        <span>{base}, est. {minH}–{maxH}h</span>
        <span className="float-right font-semibold">{fmt(minTotal)} – {fmt(maxTotal)}</span>
      </div>
    );
  }

  return (
    <div className="text-sm text-gray-500 px-4 mt-1">
      <span>{base} × {minH}h</span>
    </div>
  );
}

export function PricingTotalBlock({ estimate, pricingModel, resources, lineItems, activeTier, discountedTotal, savingsAmount }: PricingTotalBlockProps) {
  const bg = { backgroundColor: "var(--primary-color, #2563eb)" + "0a", borderLeftColor: "var(--primary-color)" };
  const hasIncentive = activeTier && discountedTotal !== undefined && savingsAmount !== undefined && savingsAmount > 0;
  const showHourly = pricingModel === "hourly" && resources?.showEstimatedHours;
  const primary = (lineItems || []).filter((li) => (li.category || "primary_service") === "primary_service");
  const derivedRate = primary.length > 0 ? primary.reduce((s, li) => s + li.unitPrice, 0) / primary.length : (resources?.hourlyRate || 0);

  return (
    <div className="mt-6 pt-4 border-t-2 border-gray-200 space-y-2">
      <div className="flex justify-between text-sm text-gray-600 px-4">
        <span>Subtotal</span><span>{fmt(estimate.subtotal)}</span>
      </div>
      {estimate.taxRate > 0 && (
        <div className="flex justify-between text-sm text-gray-600 px-4">
          <span>Tax ({estimate.taxRate}%)</span><span>{fmt(estimate.taxAmount)}</span>
        </div>
      )}
      {showHourly && resources && <HourlySubtitle resources={resources} rate={derivedRate} />}
      {hasIncentive ? (
        <div className="px-4 py-3 rounded-lg border-l-4 mt-2 space-y-2" style={bg}>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 line-through">{fmt(estimate.total)}</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: "var(--primary-color)" }}>
              {activeTier!.discountType === "percentage" ? `${activeTier!.discountValue}% OFF` : `Save ${fmt(activeTier!.discountValue)}`}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900">Total</span>
            <span className="text-3xl font-bold" style={{ color: "var(--primary-color)" }}>{fmt(discountedTotal!)}</span>
          </div>
          <p className="text-xs text-gray-500">{activeTier!.label} &mdash; {activeTier!.message}</p>
        </div>
      ) : (
        <div className="flex justify-between items-center px-4 py-3 rounded-lg border-l-4 mt-2" style={bg}>
          <span className="text-xl font-bold text-gray-900">Total</span>
          <span className="text-3xl font-bold" style={{ color: "var(--primary-color)" }}>{fmt(estimate.total)}</span>
        </div>
      )}
    </div>
  );
}
