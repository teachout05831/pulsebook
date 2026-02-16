"use client";

import { calculateTotals } from "../../utils/calculateTotals";
import type { EstimateDetail, EstimateResources } from "@/types/estimate";

interface Props {
  estimate: EstimateDetail;
  resources: EstimateResources;
  onUpdate: (r: EstimateResources) => void;
  errors?: {
    resources?: string;
  };
}

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export function HorizontalResourceBar({ estimate, resources, onUpdate, errors }: Props) {
  const totals = calculateTotals({
    lineItems: estimate.lineItems || [],
    resources: estimate.resources || {},
    pricingModel: estimate.pricingModel || "flat",
    taxRate: estimate.taxRate || 0,
    depositType: estimate.depositType as "percentage" | "fixed" | null,
    depositValue: estimate.depositAmount || 0,
    depositPaid: estimate.depositPaid || 0,
    appliedFees: estimate.appliedFees || [],
  });

  const isHourly = estimate.pricingModel === "hourly";

  return (
    <div className={`bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-2 shadow-sm mb-2 ${errors?.resources ? "ring-2 ring-red-500" : ""}`}>
      <div className="flex items-center justify-between text-white">
        {/* Left: Resource Inputs */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold">📊 Resources:</span>

          {/* Trucks */}
          <div className="flex items-center gap-1">
            <span className="text-blue-200 text-xs">Trucks</span>
            <input
              type="number"
              min="0"
              value={resources.trucks || 0}
              onChange={(e) => onUpdate({ ...resources, trucks: parseInt(e.target.value) || 0 })}
              className="w-10 px-1 py-0.5 text-sm font-bold rounded bg-white/10 border border-white/20 text-white text-center focus:outline-none focus:ring-1 focus:ring-white/40"
            />
          </div>

          <span className="text-blue-300">•</span>

          {/* Team Size */}
          <div className="flex items-center gap-1">
            <span className="text-blue-200 text-xs">Team</span>
            <input
              type="number"
              min="0"
              value={resources.teamSize || 0}
              onChange={(e) => onUpdate({ ...resources, teamSize: parseInt(e.target.value) || 0 })}
              className="w-10 px-1 py-0.5 text-sm font-bold rounded bg-white/10 border border-white/20 text-white text-center focus:outline-none focus:ring-1 focus:ring-white/40"
            />
          </div>

          <span className="text-blue-300">•</span>

          {/* Hours Range (for hourly) or Single Hours (for flat) */}
          {isHourly ? (
            <div className="flex items-center gap-1">
              <span className="text-blue-200 text-xs">Hours</span>
              <input
                type="number"
                min="0"
                step="0.5"
                value={resources.minHours || 0}
                onChange={(e) => onUpdate({ ...resources, minHours: parseFloat(e.target.value) || 0 })}
                className="w-12 px-1 py-0.5 text-sm font-bold rounded bg-white/10 border border-white/20 text-white text-center focus:outline-none focus:ring-1 focus:ring-white/40"
              />
              <span className="text-white">-</span>
              <input
                type="number"
                min="0"
                step="0.5"
                value={resources.maxHours || 0}
                onChange={(e) => onUpdate({ ...resources, maxHours: parseFloat(e.target.value) || 0 })}
                className="w-12 px-1 py-0.5 text-sm font-bold rounded bg-white/10 border border-white/20 text-white text-center focus:outline-none focus:ring-1 focus:ring-white/40"
              />
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-blue-200 text-xs">Hours</span>
              <input
                type="number"
                min="0"
                step="0.5"
                value={resources.estimatedHours || 0}
                onChange={(e) => onUpdate({ ...resources, estimatedHours: parseFloat(e.target.value) || 0 })}
                className="w-12 px-1 py-0.5 text-sm font-bold rounded bg-white/10 border border-white/20 text-white text-center focus:outline-none focus:ring-1 focus:ring-white/40"
              />
            </div>
          )}
        </div>

        {/* Right: Total */}
        <div className="flex items-center gap-2 bg-white/10 rounded px-3 py-1">
          <span className="text-xs text-blue-200">Total:</span>
          <span className="text-xl font-bold">{fmt(totals.total)}</span>
        </div>
      </div>
      {errors?.resources && (
        <div className="mt-2 bg-white rounded px-2 py-1">
          <p className="text-[10px] text-red-600">{errors.resources}</p>
        </div>
      )}
    </div>
  );
}
