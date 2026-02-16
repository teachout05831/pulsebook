'use client';

import { DollarSign, CalendarCheck, TrendingUp, Receipt, Download } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePayments } from '../hooks/usePayments';
import { usePaymentColumnPrefs } from '../hooks/usePaymentColumnPrefs';
import { PaymentsFilters } from './PaymentsFilters';
import { PaymentsTable } from './PaymentsTable';
import type { PaymentsQueryResult } from '../types';

const fmtCurrency = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

function getMonthLabel(month: string): string {
  if (!month) return new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const [y, m] = month.split('-').map(Number);
  return new Date(y, m - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function getLastMonthLabel(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

interface Props { initialData: PaymentsQueryResult; }

export function PaymentsDashboard({ initialData }: Props) {
  const hook = usePayments(initialData);
  const { visibleColumns, toggleColumn, resetToDefault } = usePaymentColumnPrefs();
  const periodLabel = hook.month ? getMonthLabel(hook.month) : (hook.dateFrom ? 'Custom Range' : getMonthLabel(''));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">Track all payments received across invoices.</p>
        </div>
        <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Export</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2.5"><DollarSign className="h-5 w-5 text-green-700" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Total Collected</p>
                <p className="text-xl font-bold">{fmtCurrency(hook.stats.totalCollected)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2.5"><CalendarCheck className="h-5 w-5 text-blue-700" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Selected Period</p>
                <p className="text-xl font-bold text-blue-700">{fmtCurrency(hook.stats.periodTotal)}</p>
                <p className="text-[10px] text-blue-500 mt-0.5">{periodLabel}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-amber-100 p-2.5"><TrendingUp className="h-5 w-5 text-amber-700" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Last Month</p>
                <p className="text-xl font-bold">{fmtCurrency(hook.stats.lastMonthTotal)}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{getLastMonthLabel()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-100 p-2.5"><Receipt className="h-5 w-5 text-purple-700" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Transactions</p>
                <p className="text-xl font-bold">{hook.stats.totalTransactions}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">All time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <PaymentsFilters
            searchInput={hook.searchInput} setSearchInput={hook.setSearchInput}
            methodFilter={hook.methodFilter} month={hook.month}
            dateFrom={hook.dateFrom} dateTo={hook.dateTo}
            visibleColumns={visibleColumns} onToggleColumn={toggleColumn} onResetColumns={resetToDefault}
            updateParams={hook.updateParams}
          />
        </CardHeader>
        <CardContent>
          <PaymentsTable
            isLoading={hook.isLoading} paginatedPayments={hook.paginatedPayments}
            isFiltered={hook.isFiltered} visibleColumns={visibleColumns}
            currentPage={hook.currentPage} pageSize={hook.pageSize}
            totalItems={hook.totalItems} totalPages={hook.totalPages}
            startIndex={hook.startIndex} updateParams={hook.updateParams}
            goToPage={hook.goToPage} router={hook.router}
          />
        </CardContent>
      </Card>
    </div>
  );
}
