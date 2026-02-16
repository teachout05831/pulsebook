export interface ServicePackage {
  id: string;
  companyId: string;
  name: string;
  visitCount: number;
  totalPrice: number;
  perVisitPrice: number;
  discountPercent: number;
  isActive: boolean;
  createdAt: string;
}

export interface CustomerPackage {
  id: string;
  companyId: string;
  customerId: string;
  packageId: string;
  packageName: string;
  jobId: string | null;
  visitsTotal: number;
  visitsUsed: number;
  amountPaid: number;
  paymentId: string | null;
  autoRenew: boolean;
  status: CustomerPackageStatus;
  purchasedAt: string;
  completedAt: string | null;
}

export type CustomerPackageStatus = "active" | "completed" | "cancelled";

export const PACKAGE_STATUS_LABELS: Record<CustomerPackageStatus, string> = {
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const PACKAGE_STATUS_COLORS: Record<CustomerPackageStatus, string> = {
  active: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-gray-100 text-gray-800",
};

export interface CreatePackageInput {
  name: string;
  visitCount: number;
  totalPrice: number;
  perVisitPrice: number;
  discountPercent?: number;
}

export interface PurchasePackageInput {
  customerId: string;
  packageId: string;
  paymentMethod: string;
  paymentDate: string;
  autoRenew?: boolean;
  referenceNumber?: string;
  notes?: string;
}
