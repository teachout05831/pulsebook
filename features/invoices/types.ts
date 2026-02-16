export type PaymentMethod = 'cash' | 'check' | 'card' | 'bank_transfer' | 'other';

export interface RecordPaymentInput {
  invoiceId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  reference?: string;
  notes?: string;
}

export interface CreateInvoiceInput {
  customerId: string;
  jobId?: string;
  issueDate: string;
  dueDate: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
  taxRate?: number;
  notes?: string;
}

export interface PaymentRow {
  payment: import('@/types').Payment;
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  jobId: string | null;
  jobTitle: string | null;
  invoiceTotal: number;
}

export interface PaymentsStats {
  totalCollected: number;
  periodTotal: number;
  lastMonthTotal: number;
  totalTransactions: number;
}

export interface PaymentsQueryParams {
  page?: number;
  pageSize?: number;
  method?: string | null;
  search?: string | null;
  month?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaymentsQueryResult {
  payments: PaymentRow[];
  stats: PaymentsStats;
  pagination: PaginationMeta;
}

export interface InvoiceListItem {
  id: string;
  customerId: string;
  customerName: string;
  jobId: string | null;
  jobTitle: string | null;
  invoiceNumber: string;
  status: string;
  issueDate: string;
  dueDate: string;
  total: number;
  amountPaid: number;
  amountDue: number;
}
