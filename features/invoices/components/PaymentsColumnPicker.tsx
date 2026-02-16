'use client';

import { Columns3, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PAYMENT_TABLE_COLUMNS } from '../constants';

interface PaymentsColumnPickerProps {
  visibleColumns: string[];
  onToggle: (columnId: string) => void;
  onReset: () => void;
}

export function PaymentsColumnPicker({ visibleColumns, onToggle, onReset }: PaymentsColumnPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Columns3 className="h-4 w-4" />Columns
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-2">
        <div className="flex items-center justify-between px-2 pb-2 border-b mb-1">
          <span className="text-xs font-medium text-muted-foreground">Show / Hide</span>
          <button onClick={onReset} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
            <RotateCcw className="h-3 w-3" />Reset
          </button>
        </div>
        {PAYMENT_TABLE_COLUMNS.map((col) => (
          <label key={col.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer text-sm">
            <Checkbox
              checked={visibleColumns.includes(col.id)}
              onCheckedChange={() => onToggle(col.id)}
              disabled={col.alwaysVisible}
            />
            {col.label}
          </label>
        ))}
      </PopoverContent>
    </Popover>
  );
}
