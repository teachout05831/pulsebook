"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { EstimateLineItem } from "@/types/estimate";

export function useJobPricing(
  jobId: string,
  initialItems: EstimateLineItem[],
  onSave: (items: EstimateLineItem[]) => Promise<{ error?: string }>
) {
  const [lineItems, setLineItems] = useState<EstimateLineItem[]>(initialItems);

  const addItem = useCallback(
    (item: EstimateLineItem) => {
      const prev = lineItems;
      const updated = [...lineItems, item];
      setLineItems(updated);
      onSave(updated).catch(() => { setLineItems(prev); toast.error("Failed to add item"); });
    },
    [lineItems, onSave]
  );

  const updateItem = useCallback(
    (id: string, changes: Partial<EstimateLineItem>) => {
      const prev = lineItems;
      const updated = lineItems.map((li) => {
        if (li.id !== id) return li;
        const merged = { ...li, ...changes };
        if (changes.quantity !== undefined || changes.unitPrice !== undefined) {
          merged.total = merged.quantity * merged.unitPrice;
        }
        return merged;
      });
      setLineItems(updated);
      onSave(updated).catch(() => { setLineItems(prev); toast.error("Failed to update item"); });
    },
    [lineItems, onSave]
  );

  const removeItem = useCallback(
    (id: string) => {
      const prev = lineItems;
      const updated = lineItems.filter((li) => li.id !== id);
      setLineItems(updated);
      onSave(updated).catch(() => { setLineItems(prev); toast.error("Failed to remove item"); });
    },
    [lineItems, onSave]
  );

  const itemsByCategory = (category: string) =>
    lineItems.filter((li) => (li.category || "primary_service") === category);

  return { lineItems, addItem, updateItem, removeItem, itemsByCategory };
}
