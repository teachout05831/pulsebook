"use client";

import type { EstimateResources } from "@/types/estimate";

interface Props {
  resources: EstimateResources;
  rate: number;
  total: number;
  textColor?: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export function HourlyRangeDisplay({ resources, rate, total, textColor = "inherit" }: Props) {
  const team = resources.teamSize || 1;
  const minH = resources.minHours;
  const maxH = resources.maxHours;

  if (!rate || !minH) return null;

  const hasRange = maxH != null && maxH > 0 && minH !== maxH;
  const subtitle = team > 1 ? `$${rate}/hr × ${team} crew` : `$${rate}/hr`;

  if (hasRange) {
    const minTotal = minH * rate * team;
    const maxTotal = maxH * rate * team;
    return (
      <div className="text-center" style={{ color: textColor }}>
        <div className="text-[11px] opacity-80">{subtitle}, est. {minH}–{maxH}h</div>
        <div className="text-xl font-bold">{fmt(minTotal)} – {fmt(maxTotal)}</div>
      </div>
    );
  }

  return (
    <div className="text-center" style={{ color: textColor }}>
      <div className="text-[11px] opacity-80">{subtitle} × {minH}h</div>
      <div className="text-xl font-bold">{fmt(total)}</div>
    </div>
  );
}
