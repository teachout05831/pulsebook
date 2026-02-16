"use client";

import { useState, useCallback, useEffect } from "react";
import { DEFAULT_PAYMENT_COLUMNS, PAYMENT_TABLE_COLUMNS } from "../constants";

const STORAGE_KEY = "sp_payments_columns";

export function usePaymentColumnPrefs() {
  const [visibleColumns, setVisibleColumns] = useState<string[]>(DEFAULT_PAYMENT_COLUMNS);

  // Load from localStorage after mount (prevents hydration mismatch)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      const validIds = new Set(PAYMENT_TABLE_COLUMNS.map((c) => c.id));
      const filtered = parsed.filter((id: string) => validIds.has(id));
      if (filtered.length > 0) setVisibleColumns(filtered);
    } catch {
      // Invalid data, keep defaults
    }
  }, []);

  // Save to localStorage when columns change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visibleColumns));
    } catch {
      // Storage full — silently ignore
    }
  }, [visibleColumns]);

  const toggleColumn = useCallback((columnId: string) => {
    const col = PAYMENT_TABLE_COLUMNS.find((c) => c.id === columnId);
    if (col?.alwaysVisible) return;
    setVisibleColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  }, []);

  const resetToDefault = useCallback(() => {
    setVisibleColumns(DEFAULT_PAYMENT_COLUMNS);
  }, []);

  return { visibleColumns, toggleColumn, resetToDefault };
}
