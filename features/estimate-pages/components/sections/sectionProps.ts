// Shared props interface for all estimate page section components.
// Each section receives these props from the page builder preview
// and the public customer-facing page renderer.

export interface SectionProps {
  section: {
    id: string;
    type: string;
    order: number;
    visible: boolean;
    settings: Record<string, unknown>;
    content: Record<string, unknown>;
  };
  brandKit?: {
    logoUrl: string | null;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    headingFont: string | null;
    companyDescription: string | null;
    tagline: string | null;
    companyPhotos: string[];
    googleRating: number | null;
    googleReviewCount: number | null;
    certifications: string[];
    insuranceInfo: string | null;
    heroImageUrl: string | null;
  } | null;
  estimate?: {
    estimateNumber: string;
    total: number;
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    lineItems: {
      description: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }[];
    pricingModel?: string;
    resources?: {
      hourlyRate: number | null;
      teamSize: number | null;
      estimatedHours: number | null;
      showEstimatedHours?: boolean;
      minHours?: number | null;
      maxHours?: number | null;
      trucks?: number | null;
    };
    customerNotes?: string;
  } | null;
  customer?: {
    name: string;
    email: string;
    phone: string;
  } | null;
  pageId?: string;
  isPreview?: boolean;
  incentiveData?: {
    activeTier: { label: string; discountType: "percentage" | "flat"; discountValue: number; message: string } | null;
    discountedTotal: number;
    savingsAmount: number;
    isExpired: boolean;
  } | null;
}
