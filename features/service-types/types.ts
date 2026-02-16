export interface ServiceType {
  id: string;
  name: string;
  description: string;
  defaultPrice: number;
  isActive: boolean;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceTypeFormData {
  name: string;
  description: string;
  defaultPrice: string;
}

export const emptyServiceTypeForm: ServiceTypeFormData = {
  name: '',
  description: '',
  defaultPrice: '',
};
