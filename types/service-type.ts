export interface ServiceType {
  id: string;
  companyId: string;
  name: string;
  description: string;
  defaultPrice: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceTypeInput {
  name: string;
  description?: string;
  defaultPrice: number;
}

export interface UpdateServiceTypeInput {
  name?: string;
  description?: string;
  defaultPrice?: number;
  isActive?: boolean;
}
