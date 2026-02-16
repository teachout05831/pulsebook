"use client";

import { Settings2, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { ColumnDefinition } from "./column-types";
import { DEFAULT_COLUMN_IDS } from "./column-types";
import { cn } from "@/lib/utils";

interface ColumnPickerProps {
  allColumns: ColumnDefinition[];
  activeColumnIds: string[];
  onColumnsChange: (ids: string[]) => void;
}

export function ColumnPicker({ allColumns, activeColumnIds, onColumnsChange }: ColumnPickerProps) {
  const coreColumns = allColumns.filter((c) => c.category === "core");
  const customColumns = allColumns.filter((c) => c.category === "custom");

  const toggle = (colId: string) => {
    if (activeColumnIds.includes(colId)) {
      onColumnsChange(activeColumnIds.filter((id) => id !== colId));
    } else {
      onColumnsChange([...activeColumnIds, colId]);
    }
  };

  const handleReset = () => onColumnsChange([...DEFAULT_COLUMN_IDS]);

  const ColumnItem = ({ col }: { col: ColumnDefinition }) => {
    const isActive = activeColumnIds.includes(col.id);
    return (
      <button
        onClick={() => toggle(col.id)}
        className={cn(
          "w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left transition-colors",
          "hover:bg-gray-100",
          isActive && "bg-blue-50",
        )}
      >
        <div
          className={cn(
            "h-4 w-4 border rounded flex items-center justify-center flex-shrink-0",
            isActive && "bg-blue-600 border-blue-600",
          )}
        >
          {isActive && <Check className="h-3 w-3 text-white" />}
        </div>
        <span className="truncate">{col.label}</span>
      </button>
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Settings2 className="h-4 w-4" />
          Columns
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[240px] p-0">
        <div className="p-2 border-b flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 uppercase">Columns</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs gap-1 text-gray-500"
            onClick={handleReset}
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        </div>

        <div className="max-h-[320px] overflow-y-auto">
          {/* Core fields */}
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-400 uppercase mb-1 px-2">Core Fields</div>
            {coreColumns.map((col) => (
              <ColumnItem key={col.id} col={col} />
            ))}
          </div>

          {/* Custom fields (only shown if any exist) */}
          {customColumns.length > 0 && (
            <div className="p-2 border-t">
              <div className="text-xs font-semibold text-gray-400 uppercase mb-1 px-2">Custom Fields</div>
              {customColumns.map((col) => (
                <ColumnItem key={col.id} col={col} />
              ))}
            </div>
          )}
        </div>

        <div className="p-2 border-t text-xs text-gray-400 text-center">
          {activeColumnIds.length} of {allColumns.length} visible
        </div>
      </PopoverContent>
    </Popover>
  );
}
