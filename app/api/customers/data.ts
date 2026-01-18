// Mock customer data for development
// This is shared between the list and detail API routes

export interface MockCustomer {
  id: string;
  companyId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string | null;
  customFields: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export const mockCustomers: MockCustomer[] = [
  { id: "1", companyId: "demo-tenant", name: "John Smith", email: "john@example.com", phone: "(555) 123-4567", address: "123 Main St, Austin, TX", notes: "Preferred customer", customFields: {}, createdAt: "2026-01-10T10:00:00Z", updatedAt: "2026-01-10T10:00:00Z" },
  { id: "2", companyId: "demo-tenant", name: "Sarah Johnson", email: "sarah@example.com", phone: "(555) 234-5678", address: "456 Oak Ave, Dallas, TX", notes: null, customFields: {}, createdAt: "2026-01-11T11:00:00Z", updatedAt: "2026-01-11T11:00:00Z" },
  { id: "3", companyId: "demo-tenant", name: "Mike Williams", email: "mike@example.com", phone: "(555) 345-6789", address: "789 Pine Rd, Houston, TX", notes: "Commercial account", customFields: {}, createdAt: "2026-01-12T09:00:00Z", updatedAt: "2026-01-12T09:00:00Z" },
  { id: "4", companyId: "demo-tenant", name: "Emily Davis", email: "emily@example.com", phone: "(555) 456-7890", address: "321 Elm St, San Antonio, TX", notes: null, customFields: {}, createdAt: "2026-01-13T14:00:00Z", updatedAt: "2026-01-13T14:00:00Z" },
  { id: "5", companyId: "demo-tenant", name: "David Brown", email: "david@example.com", phone: "(555) 567-8901", address: "654 Maple Dr, Fort Worth, TX", notes: "VIP customer", customFields: {}, createdAt: "2026-01-14T08:00:00Z", updatedAt: "2026-01-14T08:00:00Z" },
  { id: "6", companyId: "demo-tenant", name: "Lisa Anderson", email: "lisa@example.com", phone: "(555) 678-9012", address: "987 Cedar Ln, El Paso, TX", notes: null, customFields: {}, createdAt: "2026-01-14T15:00:00Z", updatedAt: "2026-01-14T15:00:00Z" },
  { id: "7", companyId: "demo-tenant", name: "Chris Martinez", email: "chris@example.com", phone: "(555) 789-0123", address: "147 Birch Blvd, Arlington, TX", notes: "Residential", customFields: {}, createdAt: "2026-01-15T10:00:00Z", updatedAt: "2026-01-15T10:00:00Z" },
  { id: "8", companyId: "demo-tenant", name: "Amanda Taylor", email: "amanda@example.com", phone: "(555) 890-1234", address: "258 Spruce Way, Plano, TX", notes: null, customFields: {}, createdAt: "2026-01-15T11:00:00Z", updatedAt: "2026-01-15T11:00:00Z" },
  { id: "9", companyId: "demo-tenant", name: "Robert Wilson", email: "robert@example.com", phone: "(555) 901-2345", address: "369 Willow Ct, Laredo, TX", notes: "Monthly service", customFields: {}, createdAt: "2026-01-16T09:00:00Z", updatedAt: "2026-01-16T09:00:00Z" },
  { id: "10", companyId: "demo-tenant", name: "Jennifer Moore", email: "jennifer@example.com", phone: "(555) 012-3456", address: "741 Ash St, Lubbock, TX", notes: null, customFields: {}, createdAt: "2026-01-16T12:00:00Z", updatedAt: "2026-01-16T12:00:00Z" },
  { id: "11", companyId: "demo-tenant", name: "Michael Lee", email: "michael@example.com", phone: "(555) 111-2222", address: "852 Redwood Ave, Garland, TX", notes: "Bi-weekly service", customFields: {}, createdAt: "2026-01-16T14:00:00Z", updatedAt: "2026-01-16T14:00:00Z" },
  { id: "12", companyId: "demo-tenant", name: "Jessica White", email: "jessica@example.com", phone: "(555) 222-3333", address: "963 Sequoia Dr, Irving, TX", notes: null, customFields: {}, createdAt: "2026-01-17T08:00:00Z", updatedAt: "2026-01-17T08:00:00Z" },
  { id: "13", companyId: "demo-tenant", name: "Daniel Harris", email: "daniel@example.com", phone: "(555) 333-4444", address: "159 Palm Rd, Amarillo, TX", notes: "New customer", customFields: {}, createdAt: "2026-01-17T09:00:00Z", updatedAt: "2026-01-17T09:00:00Z" },
  { id: "14", companyId: "demo-tenant", name: "Ashley Clark", email: "ashley@example.com", phone: "(555) 444-5555", address: "267 Cypress Ln, Brownsville, TX", notes: null, customFields: {}, createdAt: "2026-01-17T10:00:00Z", updatedAt: "2026-01-17T10:00:00Z" },
  { id: "15", companyId: "demo-tenant", name: "Matthew Lewis", email: "matthew@example.com", phone: "(555) 555-6666", address: "378 Hickory St, Grand Prairie, TX", notes: "Referral from John", customFields: {}, createdAt: "2026-01-17T11:00:00Z", updatedAt: "2026-01-17T11:00:00Z" },
];
