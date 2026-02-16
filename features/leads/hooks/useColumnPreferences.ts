"use client";

import { useState, useCallback, useEffect } from "react";
import { DEFAULT_VISIBLE_COLUMNS, LEADS_TABLE_COLUMNS } from "../constants";

const STORAGE_KEY = "sp_leads_table_columns";

function loadColumns(): string[] {
  if (typeof window === "undefined") return DEFAULT_VISIBLE_COLUMNS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_VISIBLE_COLUMNS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_VISIBLE_COLUMNS;
    const validIds = new Set(LEADS_TABLE_COLUMNS.map((c) => c.id));
    const filtered = parsed.filter((id: string) => validIds.has(id));
    return filtered.length > 0 ? filtered : DEFAULT_VISIBLE_COLUMNS;
  } catch {
    return DEFAULT_VISIBLE_COLUMNS;
  }
}

export function useColumnPreferences() {
  const [visibleColumns, setVisibleColumns] = useState<string[]>(loadColumns);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visibleColumns));
    } catch {
      // Storage full — silently ignore
    }
  }, [visibleColumns]);

  const toggleColumn = useCallback((columnId: string) => {
    const col = LEADS_TABLE_COLUMNS.find((c) => c.id === columnId);
    if (col?.alwaysVisible) return;
    setVisibleColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  }, []);

  const resetToDefault = useCallback(() => {
    setVisibleColumns(DEFAULT_VISIBLE_COLUMNS);
  }, []);

  const isVisible = useCallback(
    (columnId: string) => visibleColumns.includes(columnId),
    [visibleColumns]
  );

  return { visibleColumns, toggleColumn, resetToDefault, isVisible };
}
