"use client";

import type { EstimateDetail } from "@/types/estimate";

interface Props {
  estimate: EstimateDetail;
  onUpdate: (fields: Record<string, unknown>) => void;
  errors?: {
    serviceType?: string;
    source?: string;
  };
}

export function CompactQuoteInfo({ estimate, onUpdate, errors }: Props) {
  const hasErrors = errors?.serviceType || errors?.source;

  return (
    <div className={`bg-white rounded-lg p-2.5 ${hasErrors ? "border-2 border-red-500" : "border"}`}>
      <h3 className="text-xs font-semibold mb-1.5">Quote Info</h3>
      <div className="space-y-1.5">
        {/* Number - Inline label */}
        <div className="flex items-center gap-2">
          <label className="text-[10px] text-slate-400 w-12">Number</label>
          <p className="text-[11px] font-medium">{estimate.estimateNumber}</p>
        </div>

        {/* Service Type - Inline label */}
        <div className="flex items-start gap-2">
          <label className="text-[10px] text-slate-400 w-12 pt-0.5">Type</label>
          <div className="flex-1">
            <input
              type="text"
              value={estimate.serviceType || ""}
              onChange={(e) => onUpdate({ serviceType: e.target.value })}
              className={`w-full text-[11px] rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 ${
                errors?.serviceType
                  ? "border-2 border-red-500 focus:ring-red-500"
                  : "border focus:ring-blue-500"
              }`}
              placeholder="Service type..."
            />
            {errors?.serviceType && (
              <p className="text-[10px] text-red-600 mt-0.5">{errors.serviceType}</p>
            )}
          </div>
        </div>

        {/* Source - Inline label */}
        <div className="flex items-start gap-2">
          <label className="text-[10px] text-slate-400 w-12 pt-0.5">Source</label>
          <div className="flex-1">
            <select
              value={estimate.source || ""}
              onChange={(e) => onUpdate({ source: e.target.value })}
              className={`w-full text-[11px] rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 ${
                errors?.source
                  ? "border-2 border-red-500 focus:ring-red-500"
                  : "border focus:ring-blue-500"
              }`}
            >
              <option value="">Select source...</option>
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="phone">Phone</option>
              <option value="email">Email</option>
              <option value="walk_in">Walk-in</option>
            </select>
            {errors?.source && (
              <p className="text-[10px] text-red-600 mt-0.5">{errors.source}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
