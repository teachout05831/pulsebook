"use client";

import { Search, Calendar, Download, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { InvoicesColumnPicker } from "./InvoicesColumnPicker";

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" }, { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" }, { value: "paid", label: "Paid" },
  { value: "partial", label: "Partial" }, { value: "overdue", label: "Overdue" },
  { value: "cancelled", label: "Cancelled" },
];

interface InvoicesFiltersProps {
  total: number;
  searchInput: string;
  onSearchChange: (v: string) => void;
  onClearSearch: () => void;
  statusFilter: string;
  onStatusChange: (v: string) => void;
  dateFrom: string;
  onDateFromChange: (v: string) => void;
  dateTo: string;
  onDateToChange: (v: string) => void;
  visibleColumns: string[];
  onToggleColumn: (id: string) => void;
  onResetColumns: () => void;
  terminologyPlural: string;
}

export function InvoicesFilters({
  total, searchInput, onSearchChange, onClearSearch,
  statusFilter, onStatusChange,
  dateFrom, onDateFromChange, dateTo, onDateToChange,
  visibleColumns, onToggleColumn, onResetColumns,
  terminologyPlural,
}: InvoicesFiltersProps) {
  return (
    <div className="flex flex-col gap-3 p-4 border-b">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <h2 className="text-base font-semibold flex-shrink-0">All {terminologyPlural} ({total})</h2>
        <div className="flex-1" />

        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${terminologyPlural.toLowerCase()}...`}
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-9 h-9"
          />
          {searchInput && (
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={onClearSearch}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[140px] h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input type="date" value={dateFrom} onChange={(e) => onDateFromChange(e.target.value)} className="h-9 w-[130px]" />
          <span className="text-xs text-muted-foreground">to</span>
          <Input type="date" value={dateTo} onChange={(e) => onDateToChange(e.target.value)} className="h-9 w-[130px]" />
        </div>

        <InvoicesColumnPicker visibleColumns={visibleColumns} onToggle={onToggleColumn} onReset={onResetColumns} />

        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-1.5" />Export
        </Button>
      </div>
    </div>
  );
}
