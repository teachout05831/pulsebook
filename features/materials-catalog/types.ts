export interface MaterialsCatalogItem {
  id: string;
  companyId: string;
  name: string;
  description: string | null;
  unitPrice: number;
  unitLabel: string;
  sku: string | null;
  isTaxable: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaterialInput {
  name: string;
  description?: string;
  unitPrice: number;
  unitLabel?: string;
  sku?: string;
  isTaxable?: boolean;
}

export interface UpdateMaterialInput {
  name?: string;
  description?: string;
  unitPrice?: number;
  unitLabel?: string;
  sku?: string;
  isTaxable?: boolean;
  isActive?: boolean;
  sortOrder?: number;
}
