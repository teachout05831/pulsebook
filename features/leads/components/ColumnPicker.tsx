"use client";

import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { LEADS_TABLE_COLUMNS } from "../constants";

interface ColumnPickerProps {
  visibleColumns: string[];
  onToggle: (columnId: string) => void;
  onReset: () => void;
}

export function ColumnPicker({ visibleColumns, onToggle, onReset }: ColumnPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Settings2 className="h-4 w-4" />
          Columns
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-2">
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2 pb-2 border-b">
            <span className="text-sm font-medium">Toggle Columns</span>
            <button
              onClick={onReset}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              Reset
            </button>
          </div>
          {LEADS_TABLE_COLUMNS.map((col) => (
            <label
              key={col.id}
              className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-50 cursor-pointer text-sm"
            >
              <Checkbox
                checked={visibleColumns.includes(col.id)}
                onCheckedChange={() => onToggle(col.id)}
                disabled={col.alwaysVisible}
              />
              {col.label}
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
