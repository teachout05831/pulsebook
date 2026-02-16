// Invoice status types
export type InvoiceStatus = "draft" | "sent" | "paid" | "partial" | "overdue" | "cancelled";

// Line item for invoices
export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Payment record
export interface Payment {
  id: string;
  amount: number;
  method: "cash" | "check" | "card" | "transfer" | "other";
  date: string;
  notes: string | null;
}

// Main Invoice interface
export interface Invoice {
  id: string;
  companyId: string;
  customerId: string;
  customerName: string;
  jobId: string | null;
  jobTitle: string | null;
  estimateId: string | null;
  invoiceNumber: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  payments: Payment[];
  notes: string | null;
  terms: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}

// Status labels for display
export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  partial: "Partial",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

// Status colors for badges
export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, string> = {
  draft: "bg-gray-100 text-gray-800",
  sent: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  partial: "bg-yellow-100 text-yellow-800",
  overdue: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-500",
};

// Payment method labels
export const PAYMENT_METHOD_LABELS: Record<Payment["method"], string> = {
  cash: "Cash",
  check: "Check",
  card: "Credit/Debit Card",
  transfer: "Bank Transfer",
  other: "Other",
};
