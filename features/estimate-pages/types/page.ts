import type {
  PageSection, DesignTheme, DepositType,
  EstimatePageStatus, PageLayout,
} from "./core";

export interface RateCardItem {
  name: string;
  description: string;
  unit: "per_room" | "per_hour" | "flat" | "per_sqft";
  basePrice: number;
  minPrice: number;
  maxPrice: number;
}

export interface RateCard {
  id: string;
  companyId: string;
  name: string;
  category: string | null;
  items: RateCardItem[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RateCardInput {
  name: string;
  category?: string | null;
  items: RateCardItem[];
  isActive?: boolean;
}

export interface PaymentPlan {
  name: string;
  description: string;
  amounts: number[];
}

export interface IncentiveTier {
  id: string;
  label: string;
  deadlineMode: "relative" | "absolute";
  relativeHours: number | null;
  absoluteDeadline: string | null;
  deadline: string | null;
  discountType: "percentage" | "flat";
  discountValue: number;
  message: string;
}

export interface IncentiveConfig {
  enabled: boolean;
  tiers: IncentiveTier[];
  expiredMessage: string;
  showCountdown: boolean;
  showSavings: boolean;
  baseRateLabel: string;
}

export interface EstimatePage {
  id: string;
  companyId: string;
  estimateId: string;
  templateId: string | null;
  publicToken: string;
  isActive: boolean;
  expiresAt: string | null;
  sections: PageSection[];
  designTheme: DesignTheme;
  brandOverrides: Record<string, unknown> | null;
  allowVideoCall: boolean;
  allowScheduling: boolean;
  allowChat: boolean;
  allowInstantApproval: boolean;
  requireDeposit: boolean;
  depositAmount: number | null;
  depositType: DepositType;
  paymentPlans: PaymentPlan[] | null;
  incentiveConfig: IncentiveConfig | null;
  approvedIncentiveTier: IncentiveTier | null;
  status: EstimatePageStatus;
  publishedAt: string | null;
  firstViewedAt: string | null;
  lastViewedAt: string | null;
  approvedAt: string | null;
  declinedAt: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEstimatePageInput {
  estimateId: string;
  templateId?: string;
  sections?: PageSection[];
  designTheme?: DesignTheme;
}

export interface UpdateEstimatePageInput {
  sections?: PageSection[];
  designTheme?: DesignTheme;
  brandOverrides?: Record<string, unknown> | null;
  allowVideoCall?: boolean;
  allowScheduling?: boolean;
  allowChat?: boolean;
  allowInstantApproval?: boolean;
  requireDeposit?: boolean;
  depositAmount?: number | null;
  depositType?: DepositType;
  paymentPlans?: PaymentPlan[] | null;
  incentiveConfig?: IncentiveConfig | null;
  expiresAt?: string | null;
}

export interface PageTemplate {
  id: string;
  companyId: string;
  name: string;
  description: string | null;
  category: string | null;
  thumbnailUrl: string | null;
  layout: PageLayout;
  sections: PageSection[];
  designTheme: DesignTheme;
  designSettings: Record<string, unknown>;
  incentiveConfig: IncentiveConfig | null;
  isActive: boolean;
  isDefault: boolean;
  isSystem: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}
