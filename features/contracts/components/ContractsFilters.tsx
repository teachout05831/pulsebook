"use client";

import { Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContractsColumnPicker } from "./ContractsColumnPicker";

interface ContractsFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: string;
  onStatusChange: (v: string) => void;
  templateFilter: string;
  onTemplateChange: (v: string) => void;
  dateFrom: string;
  onDateFromChange: (v: string) => void;
  dateTo: string;
  onDateToChange: (v: string) => void;
  visibleColumns: string[];
  onToggleColumn: (id: string) => void;
  onResetColumns: () => void;
}

export function ContractsFilters({
  search, onSearchChange,
  statusFilter, onStatusChange,
  templateFilter, onTemplateChange,
  dateFrom, onDateFromChange,
  dateTo, onDateToChange,
  visibleColumns, onToggleColumn, onResetColumns,
}: ContractsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b">
      <h2 className="text-base font-semibold flex-shrink-0">All Contracts</h2>
      <div className="flex-1" />

      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by customer, job, template..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[140px] h-9">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="sent">Sent</SelectItem>
          <SelectItem value="viewed">Viewed</SelectItem>
          <SelectItem value="signed">Signed</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      <Select value={templateFilter} onValueChange={onTemplateChange}>
        <SelectTrigger className="w-[160px] h-9">
          <SelectValue placeholder="All Templates" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Templates</SelectItem>
          <SelectItem value="service agreement">Service Agreement</SelectItem>
          <SelectItem value="maintenance contract">Maintenance Contract</SelectItem>
          <SelectItem value="emergency repair">Emergency Repair</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-1.5">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <Input type="date" value={dateFrom} onChange={(e) => onDateFromChange(e.target.value)} className="h-9 w-[130px]" />
        <span className="text-xs text-muted-foreground">to</span>
        <Input type="date" value={dateTo} onChange={(e) => onDateToChange(e.target.value)} className="h-9 w-[130px]" />
      </div>

      <ContractsColumnPicker
        visibleColumns={visibleColumns}
        onToggle={onToggleColumn}
        onReset={onResetColumns}
      />
    </div>
  );
}
