'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Payment } from '@/types';
import { PAYMENT_METHOD_LABELS } from '@/types';
import type { PaymentRow } from '../types';
import { PaymentsPagination } from './PaymentsPagination';
import { PaymentsTableSkeleton, PaymentsEmptyState } from './PaymentsEmptyState';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

const METHOD_COLORS: Record<Payment['method'], string> = {
  cash: 'bg-green-100 text-green-800',
  check: 'bg-blue-100 text-blue-800',
  card: 'bg-purple-100 text-purple-800',
  transfer: 'bg-cyan-100 text-cyan-800',
  other: 'bg-gray-100 text-gray-800',
};

const fmtDate = (s: string | null | undefined): string => {
  if (!s) return '-';
  try { return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  catch { return '-'; }
};

const fmtCurrency = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

interface PaymentsTableProps {
  isLoading: boolean;
  paginatedPayments: PaymentRow[];
  isFiltered: boolean;
  visibleColumns: string[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  startIndex: number;
  updateParams: (updates: Record<string, string | number>) => void;
  goToPage: (page: number) => void;
  router: AppRouterInstance;
}

export function PaymentsTable({
  isLoading, paginatedPayments, isFiltered, visibleColumns,
  currentPage, pageSize, totalItems, totalPages, startIndex,
  updateParams, goToPage, router,
}: PaymentsTableProps) {
  if (isLoading) return <PaymentsTableSkeleton />;
  if (paginatedPayments.length === 0) return <PaymentsEmptyState isFiltered={isFiltered} />;

  const show = (col: string) => visibleColumns.includes(col);
  const clickLink = (e: React.MouseEvent, path: string) => { e.stopPropagation(); router.push(path); };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {show('date') && <TableHead>Date</TableHead>}
            {show('customer') && <TableHead>Customer</TableHead>}
            {show('invoice') && <TableHead>Invoice</TableHead>}
            {show('job') && <TableHead>Job</TableHead>}
            {show('method') && <TableHead>Method</TableHead>}
            {show('amount') && <TableHead className="text-right">Amount</TableHead>}
            {show('notes') && <TableHead>Notes</TableHead>}
            {show('reference') && <TableHead>Reference</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedPayments.map((row, idx) => (
            <TableRow key={`${row.invoiceId}-${row.payment.id}-${idx}`}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => router.push(`/invoices/${row.invoiceId}`)}>
              {show('date') && <TableCell className="whitespace-nowrap">{fmtDate(row.payment.date)}</TableCell>}
              {show('customer') && (
                <TableCell className="font-medium">
                  <button onClick={(e) => clickLink(e, `/customers/${row.customerId}`)}
                    className="text-blue-600 hover:underline">{row.customerName}</button>
                </TableCell>
              )}
              {show('invoice') && (
                <TableCell>
                  <button onClick={(e) => clickLink(e, `/invoices/${row.invoiceId}`)}
                    className="text-blue-600 hover:underline">{row.invoiceNumber}</button>
                </TableCell>
              )}
              {show('job') && (
                <TableCell className="text-muted-foreground">
                  {row.jobId ? (
                    <button onClick={(e) => clickLink(e, `/jobs/${row.jobId}`)}
                      className="hover:text-blue-600">{row.jobTitle || '-'}</button>
                  ) : '-'}
                </TableCell>
              )}
              {show('method') && (
                <TableCell>
                  <Badge variant="secondary" className={METHOD_COLORS[row.payment.method]}>
                    {PAYMENT_METHOD_LABELS[row.payment.method]}
                  </Badge>
                </TableCell>
              )}
              {show('amount') && (
                <TableCell className="text-right font-medium text-green-600">{fmtCurrency(row.payment.amount)}</TableCell>
              )}
              {show('notes') && (
                <TableCell className="text-muted-foreground text-sm max-w-[160px] truncate">
                  {row.payment.notes || '-'}
                </TableCell>
              )}
              {show('reference') && <TableCell className="text-muted-foreground text-sm">-</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaymentsPagination currentPage={currentPage} pageSize={pageSize}
        totalItems={totalItems} totalPages={totalPages} startIndex={startIndex}
        updateParams={updateParams} goToPage={goToPage} />
    </>
  );
}
