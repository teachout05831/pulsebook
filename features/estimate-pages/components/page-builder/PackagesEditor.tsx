"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import type { PackageItem } from "../TierSelectionContext";

interface Props {
  packages: PackageItem[];
  onChange: (packages: PackageItem[]) => void;
}

const empty: PackageItem = {
  name: "New Package",
  price: 0,
  features: [],
  recommended: false,
  tierLabel: "",
  savingsNote: "",
  priceNote: "",
};

export function PackagesEditor({ packages, onChange }: Props) {
  const update = (i: number, field: keyof PackageItem, value: unknown) => {
    const copy = [...packages];
    copy[i] = { ...copy[i], [field]: value };
    onChange(copy);
  };
  const remove = (i: number) => onChange(packages.filter((_, idx) => idx !== i));
  const add = () => onChange([...packages, { ...empty }]);

  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold">Service Packages</Label>
      {packages.map((pkg, i) => (
        <div key={`pkg-${i}`} className="relative space-y-1.5 rounded border p-2.5 pr-8">
          <button type="button" onClick={() => remove(i)}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <div className="space-y-1">
            <Label className="text-[11px]">Tier Label</Label>
            <Input className="h-7 text-xs" placeholder="e.g. GOOD" value={pkg.tierLabel || ""} onChange={(e) => update(i, "tierLabel", e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px]">Package Name</Label>
            <Input className="h-7 text-xs" placeholder="e.g. Basic Service" value={pkg.name} onChange={(e) => update(i, "name", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-[11px]">Price</Label>
              <Input className="h-7 text-xs" type="number" placeholder="0" value={pkg.price || ""} onChange={(e) => update(i, "price", Number(e.target.value))} />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">Price Note</Label>
              <Input className="h-7 text-xs" placeholder="e.g. /project" value={pkg.priceNote || ""} onChange={(e) => update(i, "priceNote", e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-[11px]">Savings Note</Label>
            <Input className="h-7 text-xs" placeholder="e.g. Save $500" value={pkg.savingsNote || ""} onChange={(e) => update(i, "savingsNote", e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px]">Features (one per line)</Label>
            <Textarea className="text-xs min-h-[60px]" placeholder="Feature 1&#10;Feature 2&#10;Feature 3" value={pkg.features.join("\n")} onChange={(e) => update(i, "features", e.target.value.split("\n").filter(Boolean))} rows={3} />
          </div>
          <div className="flex items-center justify-between pt-1">
            <Label className="text-[11px]">Recommended</Label>
            <Switch checked={!!pkg.recommended} onCheckedChange={(v) => {
              const copy = packages.map((p, idx) => ({ ...p, recommended: idx === i ? v : false }));
              onChange(copy);
            }} />
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-full text-xs h-7" onClick={add}>
        <Plus className="h-3 w-3 mr-1" /> Add Package
      </Button>
    </div>
  );
}
