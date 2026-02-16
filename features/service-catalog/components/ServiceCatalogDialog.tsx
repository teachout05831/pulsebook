"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { ServiceCatalogItem } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description?: string; category: string; pricingModel: string; defaultPrice: number; unitLabel?: string; isTaxable: boolean }) => Promise<{ error?: string }>;
  editingItem?: ServiceCatalogItem | null;
}

export function ServiceCatalogDialog({ isOpen, onClose, onSave, editingItem }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("primary");
  const [pricingModel, setPricingModel] = useState("flat");
  const [defaultPrice, setDefaultPrice] = useState("");
  const [unitLabel, setUnitLabel] = useState("");
  const [isTaxable, setIsTaxable] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setDescription(editingItem.description || "");
      setCategory(editingItem.category);
      setPricingModel(editingItem.pricingModel);
      setDefaultPrice(String(editingItem.defaultPrice));
      setUnitLabel(editingItem.unitLabel || "");
      setIsTaxable(editingItem.isTaxable);
    } else {
      setName("");
      setDescription("");
      setCategory("primary");
      setPricingModel("flat");
      setDefaultPrice("");
      setUnitLabel("");
      setIsTaxable(true);
    }
    setError(null);
  }, [editingItem, isOpen]);

  const handleSave = async () => {
    if (!name.trim()) { setError("Name is required"); return; }
    setIsSaving(true);
    setError(null);
    try {
      const result = await onSave({
        name: name.trim(),
        description: description.trim() || undefined,
        category,
        pricingModel,
        defaultPrice: parseFloat(defaultPrice) || 0,
        unitLabel: unitLabel.trim() || undefined,
        isTaxable,
      });
      if (result.error) setError(result.error);
      else onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingItem ? "Edit Service" : "Add Service"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="space-y-1.5">
            <Label htmlFor="svc-name">Name *</Label>
            <Input id="svc-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Local Move" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="svc-desc">Description</Label>
            <Input id="svc-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="additional">Additional</SelectItem>
                  <SelectItem value="trip_fee">Trip / Travel Fee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Pricing Model</Label>
              <Select value={pricingModel} onValueChange={setPricingModel}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="flat">Flat Rate</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="per_unit">Per Unit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="svc-price">Default Price ($)</Label>
              <Input id="svc-price" type="number" min="0" step="0.01" value={defaultPrice} onChange={(e) => setDefaultPrice(e.target.value)} placeholder="0.00" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="svc-unit">Unit Label</Label>
              <Input id="svc-unit" value={unitLabel} onChange={(e) => setUnitLabel(e.target.value)} placeholder="e.g. hour, trip" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="svc-tax" checked={isTaxable} onCheckedChange={setIsTaxable} />
            <Label htmlFor="svc-tax">Taxable</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : editingItem ? "Update" : "Add Service"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
