"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { EstimateBuilderSettings } from "@/types/company";

interface Props {
  settings: EstimateBuilderSettings;
  onUpdate: <K extends keyof EstimateBuilderSettings>(key: K, value: EstimateBuilderSettings[K]) => void;
}

export function PricingModelConfig({ settings, onUpdate }: Props) {
  return (
    <div className="rounded-lg border p-4 space-y-4">
      <h3 className="font-medium">Defaults</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label>Default Pricing Model</Label>
          <Select value={settings.defaultPricingModel} onValueChange={(v) => onUpdate("defaultPricingModel", v as EstimateBuilderSettings["defaultPricingModel"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="flat">Flat Rate</SelectItem>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="per_service">Per Service</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Default Binding Type</Label>
          <Select value={settings.defaultBindingType} onValueChange={(v) => onUpdate("defaultBindingType", v as EstimateBuilderSettings["defaultBindingType"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="non_binding">Non-Binding</SelectItem>
              <SelectItem value="binding">Binding</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Expiration (days)</Label>
          <Input type="number" min="1" value={settings.defaultExpirationDays} onChange={(e) => onUpdate("defaultExpirationDays", parseInt(e.target.value) || 30)} />
        </div>
      </div>
    </div>
  );
}
