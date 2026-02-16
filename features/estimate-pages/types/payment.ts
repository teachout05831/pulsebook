export type PaymentProvider = "internal" | "stripe" | "square";

export type PaymentStatus = "pending" | "processing" | "succeeded" | "failed" | "refunded";

export interface PaymentRecord {
  id: string;
  companyId: string;
  pageId: string;
  estimateId: string;
  provider: PaymentProvider;
  providerPaymentId: string | null;
  amount: number;
  currency: string;
  depositOrFull: "deposit" | "full" | "installment";
  status: PaymentStatus;
  customerEmail: string | null;
  customerName: string | null;
  metadata: Record<string, unknown> | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyPaymentSettings {
  provider: PaymentProvider;
  stripeAccountId: string | null;
  squareMerchantId: string | null;
  internalEnabled: boolean;
  allowExternalProviders: boolean;
  acceptedMethods: ("card" | "bank" | "apple_pay" | "google_pay")[];
}
