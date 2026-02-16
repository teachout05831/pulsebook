'use client';

import { Plus, Download } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useInvoicesList } from '../hooks/useInvoicesList';
import { useInvoiceColumnPrefs } from '../hooks/useInvoiceColumnPrefs';
import { useTerminology } from "@/components/providers/terminology-provider";
import { InvoicesFilters } from './InvoicesFilters';
import { InvoicesTable } from './InvoicesTable';

const fmtCurrency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

export function InvoicesListPage() {
  const h = useInvoicesList();
  const t = useTerminology();
  const { visibleColumns, toggleColumn, resetToDefault } = useInvoiceColumnPrefs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t.invoice.plural}</h1>
          <p className="text-sm text-muted-foreground">Manage billing and track payments.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Export</Button>
          <Button asChild>
            <Link href="/invoices/new" prefetch={true}><Plus className="mr-2 h-4 w-4" />New {t.invoice.singular}</Link>
          </Button>
        </div>
      </div>

      {!h.isLoading && h.totalUnpaid > 0 && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-800">Total Outstanding</p>
                <p className="text-2xl font-bold text-amber-900">{fmtCurrency(h.totalUnpaid)}</p>
                {h.unpaidCount > 0 && <p className="text-xs text-amber-600 mt-1">{h.unpaidCount} unpaid invoices</p>}
              </div>
              <Button variant="outline" size="sm" onClick={() => h.handleStatusChange('overdue')} className="border-amber-300 text-amber-800 hover:bg-amber-100">View Overdue</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <InvoicesFilters
          total={h.total}
          searchInput={h.searchInput} onSearchChange={h.setSearchInput} onClearSearch={h.clearSearch}
          statusFilter={h.statusFilter} onStatusChange={h.handleStatusChange}
          dateFrom={h.dateFrom} onDateFromChange={h.handleDateFromChange}
          dateTo={h.dateTo} onDateToChange={h.handleDateToChange}
          visibleColumns={visibleColumns} onToggleColumn={toggleColumn} onResetColumns={resetToDefault}
          terminologyPlural={t.invoice.plural}
        />
        <InvoicesTable
          invoices={h.invoices} isLoading={h.isLoading} isError={h.isError} isFiltered={h.isFiltered}
          visibleColumns={visibleColumns}
          navigatingTo={h.navigatingTo}
          onNavigate={h.navigateToInvoice}
          onNavigateJob={(jobId) => h.router.push(`/jobs/${jobId}`)}
          onNavigateCustomer={(custId) => h.router.push(`/customers/${custId}`)}
          page={h.currentPage} pageSize={h.pageSize} total={h.total} totalPages={h.totalPages}
          startItem={h.startItem} endItem={h.endItem}
          onPageChange={h.goToPage} onPageSizeChange={h.handlePageSizeChange}
        />
      </Card>
    </div>
  );
}
