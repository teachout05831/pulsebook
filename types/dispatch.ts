// Dispatch Center Types
// All 9 dispatch view types with tiered access control

export type DispatchView =
  | "timeline"
  | "list"
  | "kanban"
  | "cards"
  | "agenda"
  | "week"
  | "resource"
  | "dispatch"
  | "crew";

// View metadata for display and configuration
export interface DispatchViewInfo {
  id: DispatchView;
  label: string;
  description: string;
  icon: string; // Lucide icon name
  tier: "basic" | "professional" | "enterprise"; // Minimum plan tier required
}

// All 9 views with their metadata
export const DISPATCH_VIEWS: DispatchViewInfo[] = [
  {
    id: "timeline",
    label: "Technician + Map",
    description: "Individual technician scheduling with map view",
    icon: "LayoutDashboard",
    tier: "basic",
  },
  {
    id: "list",
    label: "List View",
    description: "Table format with sortable columns",
    icon: "List",
    tier: "basic",
  },
  {
    id: "kanban",
    label: "Kanban Board",
    description: "Trello style - drag cards between status columns",
    icon: "Columns3",
    tier: "basic",
  },
  {
    id: "cards",
    label: "Job Cards",
    description: "Rich card grid with job details",
    icon: "LayoutGrid",
    tier: "basic",
  },
  {
    id: "agenda",
    label: "Agenda",
    description: "Google Calendar style - chronological list by day",
    icon: "CalendarDays",
    tier: "professional",
  },
  {
    id: "week",
    label: "Week Calendar",
    description: "Jobber style - 7-day grid with hour slots",
    icon: "Calendar",
    tier: "professional",
  },
  {
    id: "resource",
    label: "Resource Grid",
    description: "Availability matrix - technicians vs time slots",
    icon: "Grid3x3",
    tier: "professional",
  },
  {
    id: "dispatch",
    label: "Dispatch Board",
    description: "ServiceTitan style - unassigned jobs, swimlanes, details",
    icon: "Truck",
    tier: "enterprise",
  },
  {
    id: "crew",
    label: "Crew + Map",
    description: "Crew/truck-based scheduling with map view",
    icon: "Users",
    tier: "enterprise",
  },
];

// Plan/subscription tier definitions
export type PlanTier = "basic" | "professional" | "enterprise";

export interface PlanFeatures {
  tier: PlanTier;
  availableViews: DispatchView[];
  maxTechnicians: number;
  maxJobsPerDay: number;
}

// Plan tier configurations
export const PLAN_FEATURES: Record<PlanTier, PlanFeatures> = {
  basic: {
    tier: "basic",
    availableViews: ["timeline", "list", "kanban", "cards"],
    maxTechnicians: 5,
    maxJobsPerDay: 50,
  },
  professional: {
    tier: "professional",
    availableViews: ["timeline", "list", "kanban", "cards", "agenda", "week", "resource"],
    maxTechnicians: 25,
    maxJobsPerDay: 200,
  },
  enterprise: {
    tier: "enterprise",
    availableViews: ["timeline", "list", "kanban", "cards", "agenda", "week", "resource", "dispatch", "crew"],
    maxTechnicians: -1, // Unlimited
    maxJobsPerDay: -1, // Unlimited
  },
};

// Company-level dispatch settings (admin configures which views are enabled)
export interface CompanyDispatchSettings {
  enabledViews: DispatchView[];
  defaultView: DispatchView;
  showStatsBar: boolean;
  showTechnicianFilter: boolean;
  allowDragDrop: boolean;
  refreshInterval: number; // seconds, 0 = manual refresh only
}

export const defaultCompanyDispatchSettings: CompanyDispatchSettings = {
  enabledViews: ["timeline", "list", "kanban", "cards", "crew"],
  defaultView: "timeline",
  showStatsBar: true,
  showTechnicianFilter: true,
  allowDragDrop: true,
  refreshInterval: 0, // 0 = manual refresh only (use refresh button)
};

// User-level preferences (each user can customize their experience)
export interface UserDispatchPreferences {
  favoriteViews: DispatchView[];
  defaultView: DispatchView | null; // null = use company default
  compactMode: boolean;
  showCompletedJobs: boolean;
  dateRangePreference: "day" | "3day" | "week" | "custom";
}

export const defaultUserDispatchPreferences: UserDispatchPreferences = {
  favoriteViews: [],
  defaultView: null,
  compactMode: false,
  showCompletedJobs: false,
  dateRangePreference: "day",
};

// Dispatch job - extends base Job with additional dispatch-specific fields
export interface DispatchJob {
  id: string;
  companyId: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  title: string;
  description: string | null;
  status: "unassigned" | "scheduled" | "in_progress" | "completed" | "cancelled";
  scheduledDate: string;
  scheduledTime: string | null;
  estimatedDuration: number; // minutes
  address: string;
  latitude?: number;
  longitude?: number;
  assignedTechnicianId: string | null;
  assignedTechnicianName: string | null;
  assignedCrewId: string | null;
  assignedCrewName: string | null;
  dispatchedAt: string | null; // null = not yet visible to tech portal
  priority: "low" | "normal" | "high" | "urgent";
  notes: string | null;
  estimateId?: string | null;
  invoiceId?: string | null;
  jobType?: string | null; // Service type (e.g., "HVAC Repair", "Plumbing")
  photoUrls?: string[]; // CDN URLs from file_uploads
  customFields: Record<string, unknown>; // Custom field values from jobs table
}

// Technician with availability info for dispatch
export interface DispatchTechnician {
  id: string;
  databaseId: string; // Actual UUID from team_members table
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  color: string; // Hex color for calendar display
  isActive: boolean;
  isAvailable: boolean; // Currently available for dispatch
  currentJobId?: string | null;
  todayJobCount: number;
  todayCompletedCount: number;
  role?: string; // Technician role (e.g., "Lead Technician", "Apprentice")
  skills?: string[]; // Skills/certifications (e.g., ["HVAC", "Plumbing"])
  status: "available" | "busy" | "offline" | "break";
}

// Crew for crew-based dispatching
export interface DispatchCrew {
  id: string;
  databaseId: string; // Actual UUID from crews table
  name: string;
  color: string;
  vehicleName: string | null;
  leadMemberId: string | null;
  leadMemberName: string | null;
  members: DispatchTechnician[];
  todayJobCount: number;
  todayCompletedCount: number;
  isActive: boolean;
}

// Dispatch publish status
export interface DispatchStatus {
  isDispatched: boolean;
  dispatchedAt: string | null;
  dispatchedBy: string | null;
  hasChangesAfterDispatch: boolean;
}

// Date range for filtering
export interface DispatchDateRange {
  start: Date;
  end: Date;
}

// Filter state for dispatch views
export interface DispatchFilters {
  technicianIds: string[];
  crewIds: string[];
  statuses: DispatchJob["status"][];
  priorities: DispatchJob["priority"][];
  searchQuery: string;
}

export const defaultDispatchFilters: DispatchFilters = {
  technicianIds: [],
  crewIds: [],
  statuses: [],
  priorities: [],
  searchQuery: "",
};

// Stats for the stats bar
export interface DispatchStats {
  total: number;
  unassigned: number;
  scheduled: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}

// View access result from useViewAccess hook
export interface ViewAccessResult {
  // What the user can access based on all three levels
  availableViews: DispatchView[];
  // Check if specific view is accessible
  canAccess: (view: DispatchView) => boolean;
  // Default view considering user > company > plan precedence
  effectiveDefaultView: DispatchView;
  // Settings
  companySettings: CompanyDispatchSettings;
  userPreferences: UserDispatchPreferences;
  planTier: PlanTier;
}

// Helper function to get view info by id
export function getViewInfo(viewId: DispatchView): DispatchViewInfo | undefined {
  return DISPATCH_VIEWS.find((v) => v.id === viewId);
}

// Helper function to check if a view is available for a plan tier
export function isViewAvailableForTier(view: DispatchView, tier: PlanTier): boolean {
  return PLAN_FEATURES[tier].availableViews.includes(view);
}
