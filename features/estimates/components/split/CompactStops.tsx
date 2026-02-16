"use client";

import type { EstimateLocation } from "@/types/estimate";

interface Props {
  locations: EstimateLocation[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  errors?: {
    locations?: string;
  };
}

export function CompactStops({ locations, onAdd, onRemove, errors }: Props) {
  const origins = locations.filter((l) => l.locationType === "origin");
  const destinations = locations.filter((l) => l.locationType === "destination");

  return (
    <div className={`bg-white rounded-lg p-2.5 ${errors?.locations ? "border-2 border-red-500" : "border"}`}>
      <div className="flex justify-between items-center mb-1.5">
        <h3 className="text-xs font-semibold">Stops</h3>
        <button onClick={onAdd} className="text-blue-600 text-[10px] hover:text-blue-700">
          + Add
        </button>
      </div>
      {errors?.locations && (
        <p className="text-[10px] text-red-600 mb-1.5">{errors.locations}</p>
      )}
      <div className="space-y-1.5">
        {origins.length === 0 && destinations.length === 0 && (
          <p className="text-[10px] text-slate-400 italic">No stops added yet</p>
        )}
        {origins.map((loc) => (
          <div key={loc.id} className="p-1.5 bg-green-50 rounded text-[11px] group relative">
            <span className="text-green-700 font-medium text-[10px]">Origin</span>
            <div className="text-[11px] mt-0.5">{loc.address || "No address"}</div>
            <button
              onClick={() => onRemove(loc.id)}
              className="absolute top-1 right-1 text-[10px] text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
        {destinations.map((loc) => (
          <div key={loc.id} className="p-1.5 bg-red-50 rounded text-[11px] group relative">
            <span className="text-red-700 font-medium text-[10px]">Dest</span>
            <div className="text-[11px] mt-0.5">{loc.address || "No address"}</div>
            <button
              onClick={() => onRemove(loc.id)}
              className="absolute top-1 right-1 text-[10px] text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
