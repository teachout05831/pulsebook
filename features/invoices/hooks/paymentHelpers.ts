import type { Invoice } from '@/types';
import type { PaymentRow, PaymentsStats } from '../types';

// Raw Supabase row shape (snake_case) for query use
export interface RawInvoiceData {
  id: string;
  invoice_number: string;
  total: number;
  customer_id: string;
  job_id: string | null;
  payments: { id: string; amount: number; method: string; date: string; notes: string | null }[];
  customers: { name: string } | { name: string }[] | null;
  jobs: { title: string } | { title: string }[] | null;
}

export function flattenRawPayments(invoices: RawInvoiceData[]): PaymentRow[] {
  const rows: PaymentRow[] = [];
  for (const inv of invoices) {
    const cust = Array.isArray(inv.customers) ? inv.customers[0] : inv.customers;
    const job = Array.isArray(inv.jobs) ? inv.jobs[0] : inv.jobs;
    for (const p of inv.payments || []) {
      rows.push({
        payment: { id: p.id, amount: p.amount, method: p.method as PaymentRow['payment']['method'], date: p.date, notes: p.notes },
        invoiceId: inv.id, invoiceNumber: inv.invoice_number,
        customerId: inv.customer_id, customerName: cust?.name || '',
        jobId: inv.job_id, jobTitle: job?.title || null, invoiceTotal: inv.total,
      });
    }
  }
  rows.sort((a, b) => new Date(b.payment.date).getTime() - new Date(a.payment.date).getTime());
  return rows;
}

export function extractPayments(invoices: Invoice[]): PaymentRow[] {
  const rows = invoices.flatMap((invoice) =>
    (invoice.payments || []).map((payment) => ({
      payment,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      customerId: invoice.customerId,
      customerName: invoice.customerName,
      jobId: invoice.jobId || null,
      jobTitle: (invoice as Invoice & { jobTitle?: string }).jobTitle || null,
      invoiceTotal: invoice.total,
    }))
  );
  rows.sort((a, b) =>
    new Date(b.payment.date).getTime() - new Date(a.payment.date).getTime()
  );
  return rows;
}

export function filterPayments(
  rows: PaymentRow[], query: string, method: string,
  dateFrom?: string | null, dateTo?: string | null,
): PaymentRow[] {
  let filtered = rows;
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter((row) =>
      row.customerName.toLowerCase().includes(q) ||
      row.invoiceNumber.toLowerCase().includes(q) ||
      (row.jobTitle && row.jobTitle.toLowerCase().includes(q)) ||
      (row.payment.notes && row.payment.notes.toLowerCase().includes(q))
    );
  }
  if (method && method !== 'all') {
    filtered = filtered.filter((row) => row.payment.method === method);
  }
  if (dateFrom) {
    filtered = filtered.filter((row) => row.payment.date >= dateFrom);
  }
  if (dateTo) {
    filtered = filtered.filter((row) => row.payment.date <= `${dateTo}T23:59:59`);
  }
  return filtered;
}

export function computeStats(allRows: PaymentRow[], periodRows: PaymentRow[]): PaymentsStats {
  const totalCollected = allRows.reduce((sum, r) => sum + r.payment.amount, 0);
  const periodTotal = periodRows.reduce((sum, r) => sum + r.payment.amount, 0);

  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthTotal = allRows
    .filter((r) => {
      const d = new Date(r.payment.date);
      return d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear();
    })
    .reduce((sum, r) => sum + r.payment.amount, 0);

  return { totalCollected, periodTotal, lastMonthTotal, totalTransactions: allRows.length };
}
