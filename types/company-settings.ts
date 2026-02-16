export interface StopReasonConfig {
  label: string
  billable: boolean
}

export interface TimeTrackingSettings {
  autoStopEnabled: boolean
  autoStopHours: number
  editPermission: 'crew_and_office' | 'office_only'
  stopReasons: StopReasonConfig[]
  statusTimerLinkEnabled: boolean
}

export interface EstimateResourceField {
  key: string;
  label: string;
  type: "number" | "text" | "select";
  options?: string[];
  enabled: boolean;
  isBuiltIn: boolean;
}

export interface EstimatePricingCategory {
  key: string;
  label: string;
  enabled: boolean;
  isRequired: boolean;
}

export interface AutoFeeDefinition {
  id: string;
  name: string;
  type: "percentage" | "fixed";
  rate: number;
  enabled: boolean;
  autoApply: boolean;
}

export interface AutoFeesSettings {
  enabled: boolean;
  fees: AutoFeeDefinition[];
}

export const defaultAutoFeesSettings: AutoFeesSettings = {
  enabled: false,
  fees: [],
};

export interface EstimateAssignmentField {
  key: "salesPerson" | "estimator" | "crew" | "technician";
  label: string;
  enabled: boolean;
}

export interface EstimateBuilderSettings {
  defaultPricingModel: "hourly" | "flat" | "per_service";
  defaultBindingType: "binding" | "non_binding";
  resourceFields: EstimateResourceField[];
  pricingCategories: EstimatePricingCategory[];
  assignmentFields?: EstimateAssignmentField[];
  depositEnabled: boolean;
  depositType: "percentage" | "fixed";
  depositAmount: number;
  defaultExpirationDays: number;
  autoFees?: AutoFeesSettings;
  defaultShowEstimatedHours?: boolean;
}

export const defaultEstimateBuilderSettings: EstimateBuilderSettings = {
  defaultPricingModel: "flat",
  defaultBindingType: "non_binding",
  resourceFields: [
    { key: "trucks", label: "Trucks / Vehicles", type: "number", enabled: true, isBuiltIn: true },
    { key: "teamSize", label: "Team Size", type: "number", enabled: true, isBuiltIn: true },
    { key: "estimatedHours", label: "Estimated Hours", type: "number", enabled: true, isBuiltIn: true },
    { key: "hourlyRate", label: "Hourly Rate", type: "number", enabled: true, isBuiltIn: true },
  ],
  pricingCategories: [
    { key: "primary_service", label: "Primary Service", enabled: true, isRequired: true },
    { key: "additional_service", label: "Additional Services", enabled: true, isRequired: false },
    { key: "materials", label: "Materials", enabled: true, isRequired: false },
    { key: "trip_fee", label: "Trip / Travel Fee", enabled: true, isRequired: false },
    { key: "valuation", label: "Valuation / Insurance", enabled: false, isRequired: false },
    { key: "discount", label: "Discounts", enabled: true, isRequired: false },
  ],
  assignmentFields: [
    { key: "salesPerson", label: "Sales Rep", enabled: true },
    { key: "estimator", label: "Estimator", enabled: true },
    { key: "crew", label: "Crew", enabled: true },
    { key: "technician", label: "Technician", enabled: true },
  ],
  depositEnabled: false,
  depositType: "percentage",
  depositAmount: 50,
  defaultExpirationDays: 30,
  defaultShowEstimatedHours: false,
};

export interface DropdownOption {
  value: string;
  label: string;
  isDefault?: boolean;
}

export interface CustomDropdowns {
  serviceTypes: DropdownOption[];
  sources: DropdownOption[];
  leadStatuses: DropdownOption[];
}

export const defaultCustomDropdowns: CustomDropdowns = {
  serviceTypes: [
    { value: "local-move", label: "Local", isDefault: true },
    { value: "long-distance", label: "Long Distance", isDefault: true },
    { value: "commercial", label: "Commercial", isDefault: true },
    { value: "packing", label: "Packing", isDefault: true },
    { value: "labor", label: "Labor Only", isDefault: true },
    { value: "cleaning", label: "Cleaning", isDefault: true },
    { value: "other", label: "Other", isDefault: true },
  ],
  sources: [
    { value: "website", label: "Website", isDefault: true },
    { value: "referral", label: "Referral", isDefault: true },
    { value: "google_ads", label: "Google Ads", isDefault: true },
    { value: "phone", label: "Phone", isDefault: true },
    { value: "walk_in", label: "Walk-in", isDefault: true },
    { value: "other", label: "Other", isDefault: true },
  ],
  leadStatuses: [
    { value: "new", label: "New", isDefault: true },
    { value: "contacted", label: "Contacted", isDefault: true },
    { value: "qualified", label: "Qualified", isDefault: true },
    { value: "proposal", label: "Proposal", isDefault: true },
    { value: "won", label: "Won", isDefault: true },
    { value: "lost", label: "Lost", isDefault: true },
  ],
};

export const defaultTimeTrackingSettings: TimeTrackingSettings = {
  autoStopEnabled: false,
  autoStopHours: 12,
  editPermission: 'crew_and_office',
  stopReasons: [
    { label: 'Break', billable: false },
    { label: 'Lunch', billable: false },
    { label: 'Travel', billable: true },
    { label: 'Waiting', billable: false },
    { label: 'Done', billable: true },
  ],
  statusTimerLinkEnabled: false,
}
