export interface ServiceCatalogItem {
  id: string;
  companyId: string;
  name: string;
  description: string | null;
  category: "primary" | "additional" | "trip_fee";
  pricingModel: "hourly" | "flat" | "per_unit";
  defaultPrice: number;
  unitLabel: string | null;
  isTaxable: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceInput {
  name: string;
  description?: string;
  category: "primary" | "additional" | "trip_fee";
  pricingModel: "hourly" | "flat" | "per_unit";
  defaultPrice: number;
  unitLabel?: string;
  isTaxable?: boolean;
}

export interface UpdateServiceInput {
  name?: string;
  description?: string;
  category?: "primary" | "additional" | "trip_fee";
  pricingModel?: "hourly" | "flat" | "per_unit";
  defaultPrice?: number;
  unitLabel?: string;
  isTaxable?: boolean;
  isActive?: boolean;
  sortOrder?: number;
}
