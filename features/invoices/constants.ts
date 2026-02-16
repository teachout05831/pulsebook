export interface InvoiceColumnDef {
  id: string;
  label: string;
  defaultVisible: boolean;
  alwaysVisible?: boolean;
}

export const INVOICE_TABLE_COLUMNS: InvoiceColumnDef[] = [
  { id: "invoiceNumber", label: "Invoice #", defaultVisible: true, alwaysVisible: true },
  { id: "customer", label: "Customer", defaultVisible: true },
  { id: "job", label: "Job", defaultVisible: true },
  { id: "status", label: "Status", defaultVisible: true },
  { id: "dueDate", label: "Due Date", defaultVisible: true },
  { id: "total", label: "Total", defaultVisible: true },
  { id: "balance", label: "Balance", defaultVisible: true },
  { id: "issueDate", label: "Issue Date", defaultVisible: false },
  { id: "address", label: "Address", defaultVisible: false },
  { id: "estimate", label: "Estimate", defaultVisible: false },
  { id: "paymentMethod", label: "Payment Method", defaultVisible: false },
  { id: "notes", label: "Notes", defaultVisible: false },
];

export const DEFAULT_INVOICE_COLUMNS = INVOICE_TABLE_COLUMNS
  .filter((c) => c.defaultVisible)
  .map((c) => c.id);

export const PAYMENT_TABLE_COLUMNS: InvoiceColumnDef[] = [
  { id: "date", label: "Date", defaultVisible: true, alwaysVisible: true },
  { id: "customer", label: "Customer", defaultVisible: true },
  { id: "invoice", label: "Invoice", defaultVisible: true },
  { id: "job", label: "Job", defaultVisible: true },
  { id: "method", label: "Method", defaultVisible: true },
  { id: "amount", label: "Amount", defaultVisible: true },
  { id: "notes", label: "Notes", defaultVisible: true },
  { id: "reference", label: "Reference #", defaultVisible: false },
];

export const DEFAULT_PAYMENT_COLUMNS = PAYMENT_TABLE_COLUMNS
  .filter((c) => c.defaultVisible)
  .map((c) => c.id);
