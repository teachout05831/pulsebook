export type CustomerStatus = "active" | "inactive" | "lead";

export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";

export interface Customer {
  id: string;
  companyId: string;
  userId: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  customFields: Record<string, unknown>;
  tags: string[];
  // Status fields
  status: CustomerStatus;
  leadStatus?: LeadStatus;
  // Lead-specific fields
  source?: string;
  estimatedValue?: number;
  serviceType?: string;
  serviceDate?: string;
  lastContactDate?: string;
  assignedTo?: string;
  accountBalance?: number;
  latestEstimateId?: string | null;
  followUpDate?: string;
  followUpId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadInput {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  source?: string;
  serviceType?: string;
  serviceDate?: string;
  estimatedValue?: number;
  notes?: string;
}
