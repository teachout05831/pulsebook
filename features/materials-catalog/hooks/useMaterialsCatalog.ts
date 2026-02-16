"use client";

import { useState, useCallback } from "react";
import type { MaterialsCatalogItem } from "../types";

export function useMaterialsCatalog(initialItems: MaterialsCatalogItem[]) {
  const [items, setItems] = useState<MaterialsCatalogItem[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/materials-catalog");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setItems(json.data);
    } catch {
      setError("Failed to load materials");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createItem = useCallback(
    async (input: { name: string; description?: string; unitPrice: number; unitLabel?: string; sku?: string; isTaxable?: boolean }) => {
      const res = await fetch("/api/materials-catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = await res.json();
      if (!res.ok) return { error: json.error || "Failed to create" };
      await refresh();
      return { success: true };
    },
    [refresh]
  );

  const updateItem = useCallback(
    async (id: string, input: Record<string, unknown>) => {
      const res = await fetch(`/api/materials-catalog/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = await res.json();
      if (!res.ok) return { error: json.error || "Failed to update" };
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...json.data } : i)));
      return { success: true };
    },
    []
  );

  const deleteItem = useCallback(
    async (id: string) => {
      const prev = items;
      setItems((p) => p.filter((i) => i.id !== id));
      const res = await fetch(`/api/materials-catalog/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setItems(prev);
        return { error: "Failed to delete" };
      }
      return { success: true };
    },
    [items]
  );

  return { items, isLoading, error, refresh, createItem, updateItem, deleteItem };
}
