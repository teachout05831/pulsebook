export interface Customer {
  id: string;
  companyId: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  customFields: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
