export interface CompanySettings {
  defaultTaxRate: number;
  defaultPaymentTerms: string;
  invoicePrefix: string;
  estimatePrefix: string;
  defaultInvoiceNotes: string;
  defaultInvoiceTerms: string;
  defaultEstimateNotes: string;
  defaultEstimateTerms: string;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  website: string;
  industry: string;
  logoUrl: string | null;
  settings: CompanySettings;
  createdAt: string;
  updatedAt: string;
}

export const defaultCompanySettings: CompanySettings = {
  defaultTaxRate: 8,
  defaultPaymentTerms: "Net 30",
  invoicePrefix: "INV-",
  estimatePrefix: "EST-",
  defaultInvoiceNotes: "Thank you for your business!",
  defaultInvoiceTerms: "Payment due within 30 days of invoice date.",
  defaultEstimateNotes: "",
  defaultEstimateTerms: "This estimate is valid for 30 days.",
};
