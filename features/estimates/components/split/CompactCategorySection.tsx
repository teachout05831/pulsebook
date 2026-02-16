"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EstimateLineItem } from "@/types/estimate";

interface Props {
  label: string;
  categoryKey: string;
  items: EstimateLineItem[];
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<EstimateLineItem>) => void;
}

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export function CompactCategorySection({ label, items, onAddItem, onRemoveItem, onUpdateItem }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  const handleUpdate = (id: string, field: keyof EstimateLineItem, value: string | number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const updates: Partial<EstimateLineItem> = { [field]: value };
    if (field === "quantity" || field === "unitPrice") {
      const qty = field === "quantity" ? Number(value) : item.quantity;
      const price = field === "unitPrice" ? Number(value) : item.unitPrice;
      updates.total = qty * price;
      if (field === "quantity") updates.quantity = Number(value);
      if (field === "unitPrice") updates.unitPrice = Number(value);
    }
    onUpdateItem(id, updates);
  };

  const categoryTotal = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="border rounded-md">
      {/* Category Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-[12px] hover:bg-slate-50 rounded-t-md"
      >
        <div className="flex items-center gap-1.5">
          {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          <span className="font-semibold">{label}</span>
          <span className="text-[10px] text-slate-400">({items.length})</span>
        </div>
        <span className="font-semibold">{categoryTotal > 0 ? fmt(categoryTotal) : "—"}</span>
      </button>

      {/* Expanded Content */}
      {isOpen && (
        <div className="border-t p-2">
          {items.length === 0 ? (
            <p className="text-[10px] text-slate-400 italic py-2 px-2">No items in this category</p>
          ) : (
            <table className="w-full text-[11px]">
              <thead>
                <tr className="text-slate-400">
                  <th className="text-left py-1 font-medium">Item</th>
                  <th className="text-center w-14 font-medium">Qty</th>
                  <th className="text-right w-20 font-medium">Price</th>
                  <th className="text-right w-20 font-medium">Total</th>
                  <th className="w-6"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.id} className={idx < items.length - 1 ? "border-b" : ""}>
                    <td className="py-1">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleUpdate(item.id, "description", e.target.value)}
                        className="w-full text-[11px] text-slate-700 border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5"
                        placeholder="Description..."
                      />
                    </td>
                    <td className="text-center">
                      <input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) => handleUpdate(item.id, "quantity", e.target.value)}
                        className="w-12 text-[11px] text-center text-slate-600 border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5"
                      />
                    </td>
                    <td className="text-right">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleUpdate(item.id, "unitPrice", e.target.value)}
                        className="w-16 text-[11px] text-right text-slate-600 border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5"
                      />
                    </td>
                    <td className="text-right text-[11px] font-medium text-slate-700">{fmt(item.total)}</td>
                    <td>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[10px] text-slate-400 hover:text-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Add Item Button */}
          <div className="mt-2 pt-1 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[10px] text-blue-600 hover:text-blue-700"
              onClick={onAddItem}
            >
              <Plus className="mr-0.5 h-2.5 w-2.5" />
              Add Item
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
