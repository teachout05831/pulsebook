"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { ServicePackage } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; visitCount: number; totalPrice: number; perVisitPrice: number; discountPercent: number; isActive?: boolean }) => Promise<{ error?: string }>;
  editingItem?: ServicePackage | null;
}

export function PackageDialog({ isOpen, onClose, onSave, editingItem }: Props) {
  const [name, setName] = useState("");
  const [visitCount, setVisitCount] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setVisitCount(String(editingItem.visitCount));
      setTotalPrice(String(editingItem.totalPrice));
      setIsActive(editingItem.isActive);
    } else {
      setName("");
      setVisitCount("");
      setTotalPrice("");
      setIsActive(true);
    }
    setError(null);
  }, [editingItem, isOpen]);

  const visits = parseInt(visitCount) || 0;
  const total = parseFloat(totalPrice) || 0;
  const perVisit = visits > 0 && total > 0 ? Math.round((total / visits) * 100) / 100 : 0;

  const handleSave = async () => {
    if (!name.trim()) { setError("Name is required"); return; }
    if (visits <= 0) { setError("Visit count must be positive"); return; }
    if (total <= 0) { setError("Total price must be positive"); return; }

    setIsSaving(true);
    setError(null);
    try {
      const result = await onSave({
        name: name.trim(),
        visitCount: visits,
        totalPrice: total,
        perVisitPrice: perVisit,
        discountPercent: 0,
        ...(editingItem ? { isActive } : {}),
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
          <DialogTitle>{editingItem ? "Edit Package" : "Add Package"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="space-y-1.5">
            <Label htmlFor="pkg-name">Package Name *</Label>
            <Input id="pkg-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. 10 Visit Package" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="pkg-visits">Number of Visits *</Label>
              <Input id="pkg-visits" type="number" min="1" value={visitCount} onChange={(e) => setVisitCount(e.target.value)} placeholder="10" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pkg-price">Total Price ($) *</Label>
              <Input id="pkg-price" type="number" min="0" step="0.01" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} placeholder="800.00" />
            </div>
          </div>
          <div className="rounded-md bg-slate-50 p-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Per Visit Price:</span>
              <span className="font-medium">{perVisit > 0 ? `$${perVisit.toFixed(2)}` : "\u2014"}</span>
            </div>
          </div>
          {editingItem && (
            <div className="flex items-center gap-2">
              <Switch id="pkg-active" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="pkg-active">Active</Label>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : editingItem ? "Update" : "Add Package"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
