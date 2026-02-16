export interface BillingSettings {
  defaultTaxRate: number;
  defaultPaymentTerms: string;
  invoicePrefix: string;
  estimatePrefix: string;
  defaultInvoiceNotes: string;
  defaultInvoiceTerms: string;
  defaultEstimateNotes: string;
  defaultEstimateTerms: string;
}

export const defaultBillingSettings: BillingSettings = {
  defaultTaxRate: 0,
  defaultPaymentTerms: 'Net 30',
  invoicePrefix: 'INV-',
  estimatePrefix: 'EST-',
  defaultInvoiceNotes: '',
  defaultInvoiceTerms: '',
  defaultEstimateNotes: '',
  defaultEstimateTerms: '',
};

export const paymentTermsOptions = [
  'Due on Receipt',
  'Net 15',
  'Net 30',
  'Net 45',
  'Net 60',
];
