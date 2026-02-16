import type { PageSection, DesignTheme } from "@/features/estimate-pages/types";

export type SchedulingPageStatus = "draft" | "published";

export interface BusinessHourSlot {
  enabled: boolean;
  start: string;
  end: string;
}

export interface BusinessHours {
  monday: BusinessHourSlot;
  tuesday: BusinessHourSlot;
  wednesday: BusinessHourSlot;
  thursday: BusinessHourSlot;
  friday: BusinessHourSlot;
  saturday: BusinessHourSlot;
  sunday: BusinessHourSlot;
}

export interface SchedulingPageSettings {
  services: string[];
  showTeamMembers: boolean;
  teamMembers: string[];
  requireApproval: boolean;
  successMessage: string;
  redirectUrl: string | null;
  businessHours: BusinessHours;
}

export interface SchedulingPage {
  id: string;
  companyId: string;
  name: string;
  slug: string;
  publicToken: string;
  sections: PageSection[];
  designTheme: DesignTheme;
  settings: SchedulingPageSettings;
  isActive: boolean;
  status: SchedulingPageStatus;
  publishedAt: string | null;
  totalViews: number;
  totalBookings: number;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSchedulingPageInput {
  name: string;
  slug: string;
}

export interface UpdateSchedulingPageInput {
  name?: string;
  slug?: string;
  sections?: PageSection[];
  designTheme?: DesignTheme;
  settings?: Partial<SchedulingPageSettings>;
  isActive?: boolean;
}

// Section content types for scheduling-specific sections
export interface ServicePickerContent {
  heading: string;
  description: string;
  layout: "grid" | "list";
  showPrices: boolean;
  showDurations: boolean;
}

export interface SchedulerContent {
  heading: string;
  description: string;
  calendarStyle: "inline" | "dropdown";
  timeSlotInterval: 15 | 30 | 60;
  advanceBookingDays: number;
  minimumNoticeHours: number;
}

export interface BookingFormContent {
  heading: string;
  description: string;
  requirePhone: boolean;
  requireEmail: boolean;
  requireAddress: boolean;
  customFields: Array<{
    id: string;
    label: string;
    type: "text" | "textarea" | "select";
    required: boolean;
    options?: string[];
  }>;
}

// Public page data (for /s/[token])
export interface PublicSchedulingPageData {
  id: string;
  name: string;
  slug: string;
  sections: PageSection[];
  designTheme: DesignTheme;
  settings: SchedulingPageSettings;
  status: SchedulingPageStatus;
  companyName: string;
  brandKit: {
    logoUrl: string | null;
    primaryColor: string;
    secondaryColor: string | null;
    accentColor: string | null;
    fontFamily: string | null;
  } | null;
  services: Array<{
    id: string;
    name: string;
    description: string;
    defaultPrice: number;
    durationMinutes: number;
  }>;
  teamMembers: Array<{
    id: string;
    name: string;
    role: string;
    color: string | null;
  }>;
}

export const DEFAULT_BUSINESS_HOURS: BusinessHours = {
  monday: { enabled: true, start: "09:00", end: "17:00" },
  tuesday: { enabled: true, start: "09:00", end: "17:00" },
  wednesday: { enabled: true, start: "09:00", end: "17:00" },
  thursday: { enabled: true, start: "09:00", end: "17:00" },
  friday: { enabled: true, start: "09:00", end: "17:00" },
  saturday: { enabled: false, start: "09:00", end: "13:00" },
  sunday: { enabled: false, start: "09:00", end: "13:00" },
};
export const DEFAULT_SCHEDULING_SETTINGS: SchedulingPageSettings = {
  services: [],
  showTeamMembers: false,
  teamMembers: [],
  requireApproval: true,
  successMessage: "Thank you! We'll confirm your appointment shortly.",
  redirectUrl: null,
  businessHours: DEFAULT_BUSINESS_HOURS,
};
export type { Booking, BookingStatus, CreateBookingInput, TimeSlot, BookingFlowState, ScoringExplanation } from './types/booking';
export type { SchedulingConfig, PriorityMode, TeamMode, TimeSlotMode, PriorityWeights, ZoneEnforcement, UpdateSchedulingConfigInput } from './types/config';
export type { Crew, ServiceZone, ZoneTravelTime, TechAvailability } from './types/crews';
