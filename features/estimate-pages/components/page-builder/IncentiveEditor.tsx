"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import type { IncentiveConfig, IncentiveTier } from "../../types";

interface Props {
  config: IncentiveConfig | null;
  onUpdate: (config: IncentiveConfig) => void;
}

function defaultConfig(): IncentiveConfig {
  return {
    enabled: false,
    tiers: [],
    expiredMessage: "Special pricing has ended",
    showCountdown: true,
    showSavings: true,
    baseRateLabel: "Standard Rate",
  };
}

function defaultTier(): IncentiveTier {
  return {
    id: crypto.randomUUID(),
    label: "",
    deadlineMode: "relative",
    relativeHours: 48,
    absoluteDeadline: null,
    deadline: null,
    discountType: "percentage",
    discountValue: 10,
    message: "",
  };
}

export function IncentiveEditor({ config, onUpdate }: Props) {
  const c = config || defaultConfig();
  const set = (u: Partial<IncentiveConfig>) => onUpdate({ ...c, ...u });
  const updateTier = (i: number, u: Partial<IncentiveTier>) => {
    const tiers = [...c.tiers];
    tiers[i] = { ...tiers[i], ...u };
    set({ tiers });
  };
  const addTier = () => set({ tiers: [...c.tiers, defaultTier()] });
  const removeTier = (i: number) => set({ tiers: c.tiers.filter((_, idx) => idx !== i) });

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold">Enable Incentive Offers</Label>
        <Switch checked={c.enabled} onCheckedChange={(v) => set({ enabled: v })} />
      </div>

      {!c.enabled ? (
        <p className="text-xs text-muted-foreground">
          Add time-sensitive discount tiers to encourage faster approvals.
        </p>
      ) : (
        <>
          {c.tiers.map((tier, i) => (
            <div key={tier.id} className="relative space-y-1.5 rounded border p-2.5 pr-8">
              <button type="button" onClick={() => removeTier(i)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <Input className="h-7 text-xs" placeholder="Tier label" value={tier.label}
                onChange={(e) => updateTier(i, { label: e.target.value })} />
              <div className="flex gap-1.5">
                <Select value={tier.deadlineMode}
                  onValueChange={(v) => updateTier(i, { deadlineMode: v as "relative" | "absolute" })}>
                  <SelectTrigger className="h-7 text-xs flex-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relative">Relative</SelectItem>
                    <SelectItem value="absolute">Absolute</SelectItem>
                  </SelectContent>
                </Select>
                {tier.deadlineMode === "relative" ? (
                  <Input type="number" className="h-7 text-xs w-20" placeholder="Hours"
                    value={tier.relativeHours ?? ""} min={0}
                    onChange={(e) => { const v = Number(e.target.value); updateTier(i, { relativeHours: v >= 0 ? v : 0 }); }} />
                ) : (
                  <Input type="datetime-local" className="h-7 text-xs flex-1"
                    value={tier.absoluteDeadline ?? ""}
                    onChange={(e) => updateTier(i, { absoluteDeadline: e.target.value || null })} />
                )}
              </div>
              <div className="flex gap-1.5">
                <Select value={tier.discountType}
                  onValueChange={(v) => updateTier(i, { discountType: v as "percentage" | "flat" })}>
                  <SelectTrigger className="h-7 text-xs flex-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="flat">Flat Amount</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="number" className="h-7 text-xs w-20" placeholder="Value" min={0}
                  value={tier.discountValue}
                  onChange={(e) => { const v = Number(e.target.value); updateTier(i, { discountValue: v >= 0 ? v : 0 }); }} />
              </div>
              <Input className="h-7 text-xs" placeholder="Tier message" value={tier.message}
                onChange={(e) => updateTier(i, { message: e.target.value })} />
            </div>
          ))}

          <Button variant="outline" size="sm" className="w-full text-xs h-7" onClick={addTier}>
            <Plus className="h-3 w-3 mr-1" /> Add Tier
          </Button>

          <div className="space-y-2.5 border-t pt-3">
            <Label className="text-xs font-semibold">Global Settings</Label>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Show Countdown</Label>
              <Switch checked={c.showCountdown}
                onCheckedChange={(v) => set({ showCountdown: v })} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Show Savings</Label>
              <Switch checked={c.showSavings}
                onCheckedChange={(v) => set({ showSavings: v })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Expired Message</Label>
              <Input className="h-7 text-xs" value={c.expiredMessage}
                onChange={(e) => set({ expiredMessage: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Base Rate Label</Label>
              <Input className="h-7 text-xs" value={c.baseRateLabel}
                onChange={(e) => set({ baseRateLabel: e.target.value })} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
