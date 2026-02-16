"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import type { ServiceCatalogItem } from "@/features/service-catalog/types";
import type { EstimateLineItem, LineItemCategory } from "@/types/estimate";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: EstimateLineItem) => void;
  category: LineItemCategory;
}

export function ServicePickerModal({ isOpen, onClose, onAdd, category }: Props) {
  const [services, setServices] = useState<ServiceCatalogItem[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ServiceCatalogItem | null>(null);
  const [qty, setQty] = useState("1");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/service-catalog").then((r) => r.json()).then((j) => setServices(j.data || []));
    setSearch(""); setSelected(null); setQty("1"); setPrice("");
  }, [isOpen]);

  useEffect(() => {
    if (selected) setPrice(String(selected.defaultPrice));
  }, [selected]);

  const filtered = services.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if (!selected) return;
    onAdd({
      id: crypto.randomUUID(),
      description: selected.name,
      quantity: parseFloat(qty) || 1,
      unitPrice: parseFloat(price) || 0,
      total: (parseFloat(qty) || 1) * (parseFloat(price) || 0),
      category,
      catalogItemId: selected.id,
      catalogType: "service",
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
        <DialogHeader><DialogTitle>Add Service</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search services..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="max-h-48 overflow-y-auto border rounded-md divide-y">
            {filtered.map((s) => (
              <button key={s.id} type="button" onClick={() => setSelected(s)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-muted/50 ${selected?.id === s.id ? "bg-blue-50" : ""}`}>
                <span className="font-medium">{s.name}</span>
                <span className="ml-2 text-muted-foreground">${s.defaultPrice.toFixed(2)}</span>
              </button>
            ))}
            {filtered.length === 0 && <p className="px-3 py-4 text-sm text-muted-foreground text-center">No services found</p>}
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
