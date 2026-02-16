"use client";

import type { EstimateDetail } from "@/types/estimate";

interface Props {
  estimate: EstimateDetail;
  onUpdate: (fields: Record<string, unknown>) => void;
}

export function CompactEstimateType({ estimate, onUpdate }: Props) {
  return (
    <div className="bg-white rounded-lg border p-2.5">
      <h3 className="text-xs font-semibold mb-1.5">Estimate Type</h3>
      <div className="grid grid-cols-2 gap-2">
        {/* Pricing Model */}
        <div className="flex flex-col">
          <label className="text-[10px] text-slate-400 mb-1">Pricing</label>
          <select
            value={estimate.pricingModel}
            onChange={(e) => onUpdate({ pricingModel: e.target.value })}
            className="w-full text-[11px] rounded px-1.5 py-0.5 border focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="hourly">Hourly</option>
            <option value="flat">Flat Rate</option>
            <option value="per_service">Per Service</option>
          </select>
        </div>

        {/* Binding Type */}
        <div className="flex flex-col">
          <label className="text-[10px] text-slate-400 mb-1">Binding</label>
          <select
            value={estimate.bindingType}
            onChange={(e) => onUpdate({ bindingType: e.target.value })}
            className="w-full text-[11px] rounded px-1.5 py-0.5 border focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="non_binding">Non-Binding</option>
            <option value="binding">Binding</option>
          </select>
        </div>
      </div>
    </div>
  );
}
