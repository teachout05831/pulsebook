import type { TeamMember } from "@/types";

export const mockTeamMembers: TeamMember[] = [
  {
    id: "tm-001",
    companyId: "company-001",
    name: "John Smith",
    email: "john@acmeservices.com",
    phone: "(555) 123-4567",
    role: "admin",
    isActive: true,
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "tm-002",
    companyId: "company-001",
    name: "Sarah Johnson",
    email: "sarah@acmeservices.com",
    phone: "(555) 234-5678",
    role: "office",
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "tm-003",
    companyId: "company-001",
    name: "Mike Williams",
    email: "mike@acmeservices.com",
    phone: "(555) 345-6789",
    role: "technician",
    isActive: true,
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
  },
  {
    id: "tm-004",
    companyId: "company-001",
    name: "Emily Davis",
    email: "emily@acmeservices.com",
    phone: "(555) 456-7890",
    role: "technician",
    isActive: true,
    createdAt: "2024-02-15T10:00:00Z",
    updatedAt: "2024-02-15T10:00:00Z",
  },
  {
    id: "tm-005",
    companyId: "company-001",
    name: "Robert Brown",
    email: "robert@acmeservices.com",
    phone: "(555) 567-8901",
    role: "technician",
    isActive: false,
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-06-01T10:00:00Z",
  },
];

let nextId = 6;

export function getNextId(): string {
  return `tm-${String(nextId++).padStart(3, "0")}`;
}
