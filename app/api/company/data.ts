import type { Company } from "@/types";
import { defaultCompanySettings } from "@/types";

// Mock company data for the demo tenant
export const mockCompany: Company = {
  id: "demo-tenant",
  name: "ServicePro Demo",
  email: "contact@serviceprodemo.com",
  phone: "(555) 000-0000",
  address: "123 Business Ave",
  city: "Austin",
  state: "TX",
  zipCode: "78701",
  website: "https://serviceprodemo.com",
  industry: "General Services",
  logoUrl: null,
  settings: defaultCompanySettings,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};
