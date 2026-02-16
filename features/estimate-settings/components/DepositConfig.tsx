"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { EstimateBuilderSettings } from "@/types/company";

interface Props {
  settings: EstimateBuilderSettings;
  onUpdate: <K extends keyof EstimateBuilderSettings>(key: K, value: EstimateBuilderSettings[K]) => void;
}

export function DepositConfig({ settings, onUpdate }: Props) {
  return (
    <div className="rounded-lg border p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Switch checked={settings.depositEnabled} onCheckedChange={(v) => onUpdate("depositEnabled", v)} />
        <h3 className="font-medium">Deposit / Down Payment</h3>
      </div>
      {settings.depositEnabled && (
        <div className="grid grid-cols-2 gap-4 pl-1">
          <div className="space-y-1.5">
            <Label>Deposit Type</Label>
            <Select value={settings.depositType} onValueChange={(v) => onUpdate("depositType", v as "percentage" | "fixed")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage (%)</SelectItem>
                <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Default Amount</Label>
            <Input type="number" min="0" step={settings.depositType === "percentage" ? "1" : "0.01"} value={settings.depositAmount} onChange={(e) => onUpdate("depositAmount", parseFloat(e.target.value) || 0)} />
          </div>
        </div>
      )}
    </div>
  );
}
