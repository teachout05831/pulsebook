export interface CompanyProfileFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  website: string;
  industry: string;
}

export interface CompanyProfile extends CompanyProfileFormData {
  id: string;
  logoUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
