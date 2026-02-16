"use client";

import { Switch } from "@/components/ui/switch";
import { Lock } from "lucide-react";
import type { EstimateBuilderSettings, EstimatePricingCategory } from "@/types/company";

interface Props {
  settings: EstimateBuilderSettings;
  onUpdate: (key: "pricingCategories", value: EstimatePricingCategory[]) => void;
}

export function PricingCategoriesConfig({ settings, onUpdate }: Props) {
  const toggleCategory = (index: number) => {
    const cat = settings.pricingCategories[index];
    if (cat.isRequired) return;
    const updated = settings.pricingCategories.map((c, i) =>
      i === index ? { ...c, enabled: !c.enabled } : c
    );
    onUpdate("pricingCategories", updated);
  };

  return (
    <div className="rounded-lg border p-4 space-y-4">
      <h3 className="font-medium">Pricing Categories</h3>
      <p className="text-sm text-muted-foreground">Enable or disable line item categories on estimates</p>
      <div className="space-y-2">
        {settings.pricingCategories.map((cat, i) => (
          <div key={cat.key} className="flex items-center gap-3 py-1.5">
            <Switch checked={cat.enabled} onCheckedChange={() => toggleCategory(i)} disabled={cat.isRequired} />
            <span className="flex-1 text-sm">{cat.label}</span>
            {cat.isRequired && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
          </div>
        ))}
      </div>
    </div>
  );
}
