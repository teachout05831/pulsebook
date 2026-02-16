"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import type { MaterialsCatalogItem } from "@/features/materials-catalog/types";
import type { EstimateLineItem } from "@/types/estimate";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: EstimateLineItem) => void;
}

export function MaterialPickerModal({ isOpen, onClose, onAdd }: Props) {
  const [materials, setMaterials] = useState<MaterialsCatalogItem[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<MaterialsCatalogItem | null>(null);
  const [qty, setQty] = useState("1");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/materials-catalog").then((r) => r.json()).then((j) => setMaterials(j.data || []));
    setSearch(""); setSelected(null); setQty("1"); setPrice("");
  }, [isOpen]);

  useEffect(() => {
    if (selected) setPrice(String(selected.unitPrice));
  }, [selected]);

  const filtered = materials.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if (!selected) return;
    onAdd({
      id: crypto.randomUUID(),
      description: selected.name,
      quantity: parseFloat(qty) || 1,
      unitPrice: parseFloat(price) || 0,
      total: (parseFloat(qty) || 1) * (parseFloat(price) || 0),
      category: "materials",
      catalogItemId: selected.id,
      catalogType: "material",
      unitLabel: selected.unitLabel || null,
      isTaxable: selected.isTaxable,
      isCustom: false,
      sortOrder: 0,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>Add Material</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search materials..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="max-h-48 overflow-y-auto border rounded-md divide-y">
            {filtered.map((m) => (
              <button key={m.id} type="button" onClick={() => setSelected(m)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-muted/50 ${selected?.id === m.id ? "bg-blue-50" : ""}`}>
                <span className="font-medium">{m.name}</span>
                <span className="ml-2 text-muted-foreground">${m.unitPrice.toFixed(2)}/{m.unitLabel}</span>
              </button>
            ))}
            {filtered.length === 0 && <p className="px-3 py-4 text-sm text-muted-foreground text-center">No materials found</p>}
          </div>
          {selected && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label className="text-xs">Quantity</Label><Input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} /></div>
              <div className="space-y-1"><Label className="text-xs">Price ($)</Label><Input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} /></div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleAdd} disabled={!selected}>Add to Estimate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
