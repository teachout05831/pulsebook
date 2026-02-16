import type { TechPortalSettings } from "@/types/company";

export interface TechJob {
  id: string;
  title: string;
  description: string | null;
  status: string;
  scheduledDate: string;
  scheduledTime: string | null;
  arrivalWindow: string | null;
  estimatedDuration: number | null;
  address: string | null;
  notes: string | null;
  crewNotes?: string | null;
  crewFeedback: string | null;
  customerNotes?: string | null;
  isCrewJob: boolean;
  customer: TechCustomerInfo;
}

export interface TechContractInfo {
  id: string;
  templateName: string;
  status: string;
  signingToken: string;
  createdAt: string;
}

export interface TechCustomerInfo {
  id: string;
  name: string;
  address: string | null;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
}

export interface TechProfile {
  teamMemberId: string;
  name: string;
  role: string;
  companyName: string;
  companyLogo: string | null;
}

export type { TechPortalSettings };
