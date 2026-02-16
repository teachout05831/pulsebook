import type { TimeTrackingSettings, EstimateBuilderSettings, CustomDropdowns } from './company-settings';
export * from './company-settings';

export interface PrebuiltFieldSettings {
  recurringJobs: boolean;
  multiStopRoutes: boolean;
}

export interface TechPortalSettings {
  enabled: boolean;
  showCustomerEmail: boolean;
  showCustomerPhone: boolean;
  showCustomerNotes: boolean;
  showContracts: boolean;
  showCrewNotes: boolean;
  showCustomerJobNotes: boolean;
}

export const defaultTechPortalSettings: TechPortalSettings = {
  enabled: false,
  showCustomerEmail: true,
  showCustomerPhone: true,
  showCustomerNotes: false,
  showContracts: true,
  showCrewNotes: true,
  showCustomerJobNotes: false,
};

export interface CustomerPortalSettings {
  enabled: boolean;
  showJobProgress: boolean;
  showCrewName: boolean;
  showNotes: boolean;
  showPhotos: boolean;
  allowPhotoUpload: boolean;
}

export const defaultCustomerPortalSettings: CustomerPortalSettings = {
  enabled: false,
  showJobProgress: true,
  showCrewName: false,
  showNotes: false,
  showPhotos: true,
  allowPhotoUpload: true,
};

export interface CrewManagementSettings {
  assignmentMode: "individual" | "crew" | "both";
  rosterType: "flexible" | "fixed";
  autoSyncMembers: boolean;
  showDailyRosterPrompt: boolean;
  allowMultiCrewMembers: boolean;
  requireCrewLead: boolean;
}

export const defaultCrewManagementSettings: CrewManagementSettings = {
  assignmentMode: "individual",
  rosterType: "fixed",
  autoSyncMembers: true,
  showDailyRosterPrompt: true,
  allowMultiCrewMembers: true,
  requireCrewLead: false,
};

export interface ArrivalWindow {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  isDefault?: boolean;
}

export const defaultArrivalWindows: ArrivalWindow[] = [
  { id: "morning", label: "Morning", startTime: "08:00", endTime: "12:00" },
  { id: "afternoon", label: "Afternoon", startTime: "12:00", endTime: "17:00" },
  { id: "evening", label: "Evening", startTime: "17:00", endTime: "20:00" },
];

export interface EntityLabel {
  singular: string;
  plural: string;
}

export interface TerminologySettings {
  estimate: EntityLabel;
  job: EntityLabel;
  customer: EntityLabel;
  invoice: EntityLabel;
  contract: EntityLabel;
  estimatePage: EntityLabel;
}

export interface CompanySettings {
  defaultTaxRate: number;
  defaultPaymentTerms: string;
  invoicePrefix: string;
  estimatePrefix: string;
  defaultInvoiceNotes: string;
  defaultInvoiceTerms: string;
  defaultEstimateNotes: string;
  defaultEstimateTerms: string;
  timeTracking?: TimeTrackingSettings;
  prebuiltFields?: PrebuiltFieldSettings;
  techPortal?: TechPortalSettings;
  crewManagement?: CrewManagementSettings;
  customerPortal?: CustomerPortalSettings;
  estimateBuilder?: EstimateBuilderSettings;
  customDropdowns?: CustomDropdowns;
  listViewSettings?: import("./list-view").ListViewSettings;
  terminology?: TerminologySettings;
  arrivalWindows?: ArrivalWindow[];
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

export const defaultTerminologySettings: TerminologySettings = {
  estimate: { singular: "Estimate", plural: "Estimates" },
  job: { singular: "Job", plural: "Jobs" },
  customer: { singular: "Customer", plural: "Customers" },
  invoice: { singular: "Invoice", plural: "Invoices" },
  contract: { singular: "Contract", plural: "Contracts" },
  estimatePage: { singular: "Estimate Page", plural: "Estimate Pages" },
};
