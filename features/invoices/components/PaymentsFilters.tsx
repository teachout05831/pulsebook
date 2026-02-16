'use client';

import { Search, X, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaymentsColumnPicker } from './PaymentsColumnPicker';

const METHOD_OPTIONS = [
  { value: 'all', label: 'All Methods' },
  { value: 'cash', label: 'Cash' },
  { value: 'check', label: 'Check' },
  { value: 'card', label: 'Card' },
  { value: 'transfer', label: 'Bank Transfer' },
  { value: 'other', label: 'Other' },
];

function buildMonthOptions(): { value: string; label: string }[] {
  const opts = [{ value: 'all', label: 'All Time' }];
  const now = new Date();
  for (let i = 2; i >= -1; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    opts.push({ value: val, label });
  }
  return opts;
}

interface PaymentsFiltersProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  methodFilter: string;
  month: string;
  dateFrom: string;
  dateTo: string;
  visibleColumns: string[];
  onToggleColumn: (id: string) => void;
  onResetColumns: () => void;
  updateParams: (updates: Record<string, string | number>) => void;
}

export function PaymentsFilters({
  searchInput, setSearchInput, methodFilter, month, dateFrom, dateTo,
  visibleColumns, onToggleColumn, onResetColumns, updateParams,
}: PaymentsFiltersProps) {
  const monthOptions = buildMonthOptions();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search payments..." value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)} className="pl-9 pr-9" />
        {searchInput && (
          <button onClick={() => { setSearchInput(''); updateParams({ q: '', page: 1 }); }}
            className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      <Select value={methodFilter} onValueChange={(v) => updateParams({ method: v, page: 1 })}>
        <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
        <SelectContent>
          {METHOD_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-1.5 border rounded-md px-3 py-1.5 bg-background">
        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
        <Select value={month || 'all'} onValueChange={(v) => updateParams({ month: v === 'all' ? '' : v, dateFrom: '', dateTo: '', page: 1 })}>
          <SelectTrigger className="border-0 p-0 h-auto shadow-none w-[110px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {monthOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-1.5">
        <Input type="date" value={dateFrom} className="w-[140px] h-9 text-sm"
          onChange={(e) => updateParams({ dateFrom: e.target.value, month: '', page: 1 })} />
        <span className="text-xs text-muted-foreground">to</span>
        <Input type="date" value={dateTo} className="w-[140px] h-9 text-sm"
          onChange={(e) => updateParams({ dateTo: e.target.value, month: '', page: 1 })} />
      </div>

      <PaymentsColumnPicker visibleColumns={visibleColumns} onToggle={onToggleColumn} onReset={onResetColumns} />
    </div>
  );
}
