"use client";

import { useState, useEffect, useMemo } from "react";
import type { CustomFieldDefinition } from "@/features/custom-fields/types";
import { CORE_COLUMNS, DEFAULT_COLUMN_IDS, customFieldToColumn } from "./column-types";
import type { ColumnDefinition } from "./column-types";

interface UseListColumnsOptions {
  activeColumnIds: string[];
}

export function useListColumns({ activeColumnIds }: UseListColumnsOptions) {
  const [customFieldDefs, setCustomFieldDefs] = useState<CustomFieldDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchFields = async () => {
      try {
        const res = await fetch("/api/custom-fields?entityType=job");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setCustomFieldDefs(data.data || []);
      } catch {
        // Custom fields are optional — fail silently
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchFields();
    return () => { cancelled = true; };
  }, []);

  const allColumns = useMemo(() => {
    const customColumns = customFieldDefs
      .filter((d) => d.isActive)
      .map(customFieldToColumn);
    return [...CORE_COLUMNS, ...customColumns];
  }, [customFieldDefs]);

  const visibleColumns = useMemo(
    () => activeColumnIds
      .map((id) => allColumns.find((c) => c.id === id))
      .filter(Boolean) as ColumnDefinition[],
    [activeColumnIds, allColumns],
  );

  const coreColumns = useMemo(
    () => allColumns.filter((c) => c.category === "core"),
    [allColumns],
  );

  const customColumns = useMemo(
    () => allColumns.filter((c) => c.category === "custom"),
    [allColumns],
  );

  return { allColumns, visibleColumns, coreColumns, customColumns, isLoading };
}

export { DEFAULT_COLUMN_IDS };
