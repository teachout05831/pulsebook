import { getAuthCompany } from '@/lib/auth/getAuthCompany';
import { flattenRawPayments, filterPayments, computeStats, type RawInvoiceData } from '../hooks/paymentHelpers';
import type { PaymentsQueryParams, PaymentsQueryResult } from '../types';

export async function getPayments(params?: PaymentsQueryParams): Promise<PaymentsQueryResult> {
  const { supabase, companyId } = await getAuthCompany();

  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10;
  const offset = (page - 1) * pageSize;

  const { data, error } = await supabase
    .from('invoices')
    .select('id, invoice_number, total, customer_id, job_id, payments, customers(name), jobs(title)')
    .eq('company_id', companyId)
    .not('payments', 'eq', '[]')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) throw new Error('Failed to fetch payments');

  const allPayments = flattenRawPayments((data || []) as RawInvoiceData[]);

  // Convert month param (e.g., "2026-02") to dateFrom/dateTo
  let dateFrom = params?.dateFrom || null;
  let dateTo = params?.dateTo || null;
  if (params?.month && !dateFrom && !dateTo) {
    const [y, m] = params.month.split('-').map(Number);
    dateFrom = `${y}-${String(m).padStart(2, '0')}-01`;
    dateTo = `${y}-${String(m).padStart(2, '0')}-${new Date(y, m, 0).getDate()}`;
  }

  const allFiltered = filterPayments(allPayments, params?.search || '', params?.method || 'all');
  const filtered = filterPayments(allPayments, params?.search || '', params?.method || 'all', dateFrom, dateTo);
  const stats = computeStats(allFiltered, filtered);
  const paginated = filtered.slice(offset, offset + pageSize);

  return {
    payments: paginated,
    stats,
    pagination: {
      page, pageSize,
      totalItems: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
    },
  };
}
