"use client";

import { Trash2 } from "lucide-react";
import type { EstimateLineItem } from "@/types/estimate";

interface Props {
  lineItems: EstimateLineItem[];
  onUpdate: (id: string, updates: Partial<EstimateLineItem>) => void;
  onRemove: (id: string) => void;
  primaryColor: string;
}

export function LiveEstimateLineItems({ lineItems, onUpdate, onRemove, primaryColor }: Props) {
  if (lineItems.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-white/30 text-xs">Add services or materials from the search above</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
      {lineItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] group"
        >
          <div className="flex-1 min-w-0">
            <div className="text-sm text-white/80 truncate">{item.description}</div>
            <div className="text-[10px] text-white/30 capitalize">{item.category?.replace("_", " ")}</div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => onUpdate(item.id, { quantity: Math.max(0, Number(e.target.value) || 0) })}
              className="w-12 bg-white/[0.05] border border-white/10 rounded px-1.5 py-0.5 text-xs text-white text-center focus:outline-none focus:border-white/20"
              min={0}
            />
            <span className="text-white/20 text-xs">x</span>
            <div className="relative">
              <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-white/30 text-xs">$</span>
              <input
                type="number"
                value={item.unitPrice}
                onChange={(e) => onUpdate(item.id, { unitPrice: Math.max(0, Number(e.target.value) || 0) })}
                className="w-20 bg-white/[0.05] border border-white/10 rounded pl-4 pr-1.5 py-0.5 text-xs text-white text-right focus:outline-none focus:border-white/20"
                min={0}
                step={0.01}
              />
            </div>
            <div className="w-16 text-right text-xs font-medium" style={{ color: primaryColor }}>
              ${item.total.toFixed(2)}
            </div>
            <button
              onClick={() => onRemove(item.id)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-red-400/60 hover:text-red-400 transition-all"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
