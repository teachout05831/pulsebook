"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { MaterialsCatalogItem } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description?: string; unitPrice: number; unitLabel?: string; sku?: string; isTaxable: boolean }) => Promise<{ error?: string }>;
  editingItem?: MaterialsCatalogItem | null;
}

export function MaterialsCatalogDialog({ isOpen, onClose, onSave, editingItem }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [unitLabel, setUnitLabel] = useState("each");
  const [sku, setSku] = useState("");
  const [isTaxable, setIsTaxable] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setDescription(editingItem.description || "");
      setUnitPrice(String(editingItem.unitPrice));
      setUnitLabel(editingItem.unitLabel || "each");
      setSku(editingItem.sku || "");
      setIsTaxable(editingItem.isTaxable);
    } else {
      setName("");
      setDescription("");
      setUnitPrice("");
      setUnitLabel("each");
      setSku("");
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
        unitPrice: parseFloat(unitPrice) || 0,
        unitLabel: unitLabel.trim() || "each",
        sku: sku.trim() || undefined,
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
          <DialogTitle>{editingItem ? "Edit Material" : "Add Material"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="space-y-1.5">
            <Label htmlFor="mat-name">Name *</Label>
            <Input id="mat-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Moving Boxes (Large)" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mat-desc">Description</Label>
            <Input id="mat-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="mat-price">Unit Price ($)</Label>
              <Input id="mat-price" type="number" min="0" step="0.01" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} placeholder="0.00" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mat-unit">Unit Label</Label>
              <Input id="mat-unit" value={unitLabel} onChange={(e) => setUnitLabel(e.target.value)} placeholder="each, box, roll" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mat-sku">SKU</Label>
            <Input id="mat-sku" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="Optional SKU/part number" />
          </div>
          <div className="flex items-center gap-2">
            <Switch id="mat-tax" checked={isTaxable} onCheckedChange={setIsTaxable} />
            <Label htmlFor="mat-tax">Taxable</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : editingItem ? "Update" : "Add Material"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
