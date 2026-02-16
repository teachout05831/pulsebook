"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EstimateResources } from "@/types/estimate";
import type { EstimateResourceField } from "@/types/company";

interface Props {
  resources: EstimateResources;
  fields: EstimateResourceField[];
  pricingModel?: string;
  onUpdate: (resources: EstimateResources) => void;
}

const TILE_OPTIONS: Record<string, string[]> = {
  trucks: ["0", "1", "2", "3", "4", "5"],
  teamSize: ["1", "2", "3", "4", "5", "6", "7", "8"],
  minHours: ["1", "2", "3", "4", "5", "6", "8", "10", "12"],
  maxHours: ["1", "2", "3", "4", "5", "6", "8", "10", "12"],
};

const DEFAULT_RESOURCES: EstimateResources = {
  trucks: null, teamSize: null, estimatedHours: null, hourlyRate: null,
  showEstimatedHours: false, minHours: null, maxHours: null, customFields: {},
};

export function ResourcesCard({ resources, fields = [], pricingModel, onUpdate }: Props) {
  const [local, setLocal] = useState(resources || DEFAULT_RESOURCES);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => { setLocal(resources || DEFAULT_RESOURCES); }, [resources]);
  useEffect(() => { return () => { if (timerRef.current) clearTimeout(timerRef.current); }; }, []);

  const debouncedUpdate = useCallback((updated: EstimateResources) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onUpdate(updated), 800);
  }, [onUpdate]);

  const handleBuiltIn = (key: keyof EstimateResources, value: string) => {
    const numVal = value === "" ? null : parseFloat(value) || 0;
    const updated = { ...local, [key]: numVal };
    if (key === "minHours") updated.estimatedHours = numVal;
    setLocal(updated);
    debouncedUpdate(updated);
  };

  const handleCustom = (key: string, value: string) => {
    const numVal = value === "" ? null : parseFloat(value) || 0;
    const updated = { ...local, customFields: { ...local.customFields, [key]: numVal } };
    setLocal(updated);
    debouncedUpdate(updated);
  };

  const handleCheckbox = (key: keyof EstimateResources, checked: boolean) => {
    const updated = { ...local, [key]: checked };
    setLocal(updated);
    debouncedUpdate(updated);
  };

  // Safety check: ensure fields is always an array
  const safeFields = fields || [];
  const customFields = safeFields.filter((f) => f.enabled && !["trucks", "teamSize", "estimatedHours", "hourlyRate", "minHours", "maxHours"].includes(f.key));

  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-[13px] font-semibold mb-3">Resources</div>

        {/* 4-tile grid */}
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { key: "trucks" as const, label: "TRUCKS" },
            { key: "teamSize" as const, label: "TEAM" },
            { key: "minHours" as const, label: "MIN HRS" },
            { key: "maxHours" as const, label: "MAX HRS" },
          ].map(({ key, label }) => (
            <div key={key} className="bg-slate-50 rounded-md p-2">
              <div className="text-[10px] text-slate-500 uppercase font-semibold tracking-wide mb-0.5">{label}</div>
              <select
                className="border-0 bg-transparent text-base font-bold text-center cursor-pointer w-full p-0 text-slate-800"
                value={String(local[key] ?? "")}
                onChange={(e) => handleBuiltIn(key, e.target.value)}
              >
                <option value="">-</option>
                {(TILE_OPTIONS[key] || []).map((v) => (
                  <option key={v} value={v}>{(key === "minHours" || key === "maxHours") ? `${v}h` : v}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Custom resource fields */}
        {customFields.length > 0 && (
          <div className="mt-3 space-y-2">
            {customFields.map((field) => {
              const val = local.customFields?.[field.key];
              return (
                <div key={field.key} className="flex items-center justify-between">
                  <Label className="text-xs text-slate-500">{field.label}</Label>
                  <Input type="number" className="h-7 w-20 text-sm text-right" value={val != null ? String(val) : ""} onChange={(e) => handleCustom(field.key, e.target.value)} placeholder="0" />
                </div>
              );
            })}
          </div>
        )}

        {/* Hourly display option */}
        {pricingModel === "hourly" && (
          <div className="mt-3 pt-3 border-t flex items-center gap-2">
            <Checkbox id="showHours" checked={!!local.showEstimatedHours} onCheckedChange={(c) => handleCheckbox("showEstimatedHours", !!c)} />
            <Label htmlFor="showHours" className="text-xs text-slate-600 cursor-pointer">Show hours to customer</Label>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
