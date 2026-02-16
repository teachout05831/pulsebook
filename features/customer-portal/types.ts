import type { CustomerPortalSettings } from "@/types/company";

export interface CustomerPortalUser {
  authUserId: string;
  customerId: string;
  companyId: string;
  name: string;
  email: string;
}

export interface CustomerDashboardStats {
  pendingEstimates: number;
  activeJobs: number;
  unpaidInvoices: number;
  lifetimeTotal: number;
}

export interface CustomerProfileData {
  customerId: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  companyName: string;
  companyLogo: string | null;
  primaryColor: string | null;
  portalSettings: CustomerPortalSettings;
}

export interface RecentActivity {
  id: string;
  type: "estimate" | "job" | "invoice" | "contract";
  title: string;
  status: string;
  date: string;
}

export interface CustomerEstimate {
  id: string;
  estimateNumber: string;
  status: string;
  total: number;
  createdAt: string;
  publicToken: string | null;
}

export interface CustomerContract {
  id: string;
  templateName: string | null;
  status: string;
  createdAt: string;
  signedAt: string | null;
  signingToken: string | null;
}

export interface CustomerAppointment {
  id: string;
  type: "job" | "consultation";
  title: string;
  date: string;
  status: string;
  publicToken: string | null;
}

export interface CustomerJob {
  id: string;
  title: string;
  status: string;
  scheduledDate: string | null;
  crewName: string | null;
}

export interface CustomerJobDetail {
  id: string;
  title: string;
  description: string | null;
  status: string;
  scheduledDate: string | null;
  scheduledTime: string | null;
  address: string | null;
  notes: string | null;
  crewName: string | null;
  photos: CustomerJobPhoto[];
}

export interface CustomerJobPhoto {
  id: string;
  url: string;
  fileName: string;
  createdAt: string;
}

export interface CustomerInvoice {
  id: string;
  invoiceNumber: string;
  status: string;
  total: number;
  amountPaid: number;
  balanceDue: number;
  dueDate: string | null;
  createdAt: string;
}

export interface CustomerDocument {
  id: string;
  fileName: string;
  fileType: string;
  url: string;
  category: string;
  createdAt: string;
}

export interface CustomerAccountData {
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
}

export interface UpdateAccountInput {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export type { CustomerPortalSettings };
