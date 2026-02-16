export type PaymentMethod = "cash" | "check" | "card" | "bank_transfer" | "other";

export type PaymentStatus = "completed" | "voided";

export interface Payment {
  id: string;
  companyId: string;
  customerId: string;
  estimateId: string | null;
  jobId: string | null;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  referenceNumber: string | null;
  ccFeeAmount: number;
  ccFeeRate: number;
  notes: string | null;
  receivedBy: string | null;
  paymentDate: string;
  createdAt: string;
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Cash",
  check: "Check",
  card: "Credit/Debit Card",
  bank_transfer: "Bank Transfer",
  other: "Other",
};

export interface RecordPaymentInput {
  entityType: "estimate" | "job";
  entityId: string;
  amount: number;
  method: PaymentMethod;
  paymentDate: string;
  referenceNumber?: string;
  notes?: string;
}
