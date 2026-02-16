"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { EstimateLineItem, LineItemCategory } from "@/types/estimate";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: EstimateLineItem) => void;
  defaultCategory?: LineItemCategory;
}

export function CustomLineItemModal({ isOpen, onClose, onAdd, defaultCategory = "primary_service" }: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<LineItemCategory>(defaultCategory);
  const [qty, setQty] = useState("1");
  const [price, setPrice] = useState("");
  const [isTaxable, setIsTaxable] = useState(true);

  useEffect(() => {
    if (isOpen) { setName(""); setCategory(defaultCategory); setQty("1"); setPrice(""); setIsTaxable(true); }
  }, [isOpen, defaultCategory]);

  const handleAdd = () => {
    if (!name.trim()) return;
    const q = parseFloat(qty) || 1;
    const p = parseFloat(price) || 0;
    onAdd({
      id: crypto.randomUUID(),
      description: name.trim(),
      quantity: q,
      unitPrice: p,
      total: q * p,
      category,
      catalogItemId: null,
      catalogType: null,
      unitLabel: null,
      isTaxable,
      isCustom: true,
      sortOrder: 0,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Add Custom Item</DialogTitle></DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1"><Label>Description *</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name" /></div>
          <div className="space-y-1">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as LineItemCategory)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="primary_service">Primary Service</SelectItem>
                <SelectItem value="additional_service">Additional Service</SelectItem>
                <SelectItem value="materials">Materials</SelectItem>
                <SelectItem value="trip_fee">Trip Fee</SelectItem>
                <SelectItem value="valuation">Valuation / Insurance</SelectItem>
                <SelectItem value="discount">Discount</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label>Qty</Label><Input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} /></div>
            <div className="space-y-1"><Label>Price ($)</Label><Input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} /></div>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isTaxable} onCheckedChange={setIsTaxable} /><Label>Taxable</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleAdd} disabled={!name.trim()}>Add Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
