import type { ServiceType } from "@/types";

export const mockServiceTypes: ServiceType[] = [
  {
    id: "st-001",
    companyId: "company-001",
    name: "Standard Service Call",
    description: "Basic service visit including diagnostics and minor repairs",
    defaultPrice: 89.00,
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "st-002",
    companyId: "company-001",
    name: "Emergency Service",
    description: "After-hours or urgent service call with priority response",
    defaultPrice: 149.00,
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "st-003",
    companyId: "company-001",
    name: "Maintenance Inspection",
    description: "Comprehensive system inspection and preventive maintenance",
    defaultPrice: 129.00,
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "st-004",
    companyId: "company-001",
    name: "Installation - Basic",
    description: "Standard equipment installation",
    defaultPrice: 250.00,
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "st-005",
    companyId: "company-001",
    name: "Installation - Complex",
    description: "Complex installation requiring additional time and materials",
    defaultPrice: 450.00,
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
];

let nextId = 6;

export function getNextId(): string {
  return `st-${String(nextId++).padStart(3, "0")}`;
}
