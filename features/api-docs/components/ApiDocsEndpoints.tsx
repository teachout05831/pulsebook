import { Section, EndpointRow, ResourceSection } from "./ApiDocsHelpers"

export function ApiDocsEndpoints() {
  return (
    <Section title="Endpoints">
      <ResourceSection
        name="Customers"
        base="/api/v1/customers"
        description="Manage customer profiles, contacts, and lead tracking."
        statuses="active, inactive, lead"
        endpoints={[
          { method: "GET", path: "/api/v1/customers", desc: "List customers (paginated)" },
          { method: "POST", path: "/api/v1/customers", desc: "Create a customer" },
          { method: "GET", path: "/api/v1/customers/{id}", desc: "Get customer detail" },
          { method: "PATCH", path: "/api/v1/customers/{id}", desc: "Update a customer" },
          { method: "DELETE", path: "/api/v1/customers/{id}", desc: "Delete a customer" },
        ]}
        createFields="name (required), email, phone, address, notes, status, leadStatus, source, estimatedValue, serviceType, customFields, tags"
      />
      <ResourceSection
        name="Jobs"
        base="/api/v1/jobs"
        description="Schedule and manage service jobs linked to customers."
        statuses="pending, scheduled, in_progress, completed, cancelled"
        endpoints={[
          { method: "GET", path: "/api/v1/jobs", desc: "List jobs (paginated)" },
          { method: "POST", path: "/api/v1/jobs", desc: "Create a job" },
          { method: "GET", path: "/api/v1/jobs/{id}", desc: "Get job detail" },
          { method: "PATCH", path: "/api/v1/jobs/{id}", desc: "Update a job" },
          { method: "DELETE", path: "/api/v1/jobs/{id}", desc: "Delete a job" },
        ]}
        createFields="title (required), customerId, description, status, scheduledDate, scheduledTime, estimatedDuration, address, assignedTo, notes, customFields"
      />
      <ResourceSection
        name="Estimates"
        base="/api/v1/estimates"
        description="Create and manage quotations/estimates for customers."
        statuses="draft, sent, viewed, approved, rejected, expired"
        endpoints={[
          { method: "GET", path: "/api/v1/estimates", desc: "List estimates (paginated)" },
          { method: "POST", path: "/api/v1/estimates", desc: "Create an estimate (auto-generates number)" },
          { method: "GET", path: "/api/v1/estimates/{id}", desc: "Get estimate detail" },
          { method: "PATCH", path: "/api/v1/estimates/{id}", desc: "Update an estimate" },
          { method: "DELETE", path: "/api/v1/estimates/{id}", desc: "Delete an estimate" },
        ]}
        createFields="customerId (required), lineItems, taxRate, issueDate, expiryDate, notes, terms, address, status"
      />
      <ResourceSection
        name="Invoices"
        base="/api/v1/invoices"
        description="Generate invoices, track payments and balances."
        statuses="draft, sent, viewed, paid, partial, overdue, cancelled"
        endpoints={[
          { method: "GET", path: "/api/v1/invoices", desc: "List invoices (paginated)" },
          { method: "POST", path: "/api/v1/invoices", desc: "Create an invoice (auto-generates number)" },
          { method: "GET", path: "/api/v1/invoices/{id}", desc: "Get invoice detail" },
          { method: "PATCH", path: "/api/v1/invoices/{id}", desc: "Update an invoice" },
          { method: "DELETE", path: "/api/v1/invoices/{id}", desc: "Delete an invoice" },
        ]}
        createFields="customerId (required), jobId, estimateId, lineItems, taxRate, issueDate, dueDate, notes, terms, address, status"
      />
      <ResourceSection
        name="Contracts"
        base="/api/v1/contracts"
        description="Create contract instances from templates for digital signing."
        statuses="draft, sent, viewed, signed, paid, completed, cancelled"
        endpoints={[
          { method: "GET", path: "/api/v1/contracts", desc: "List contracts (paginated)" },
          { method: "POST", path: "/api/v1/contracts", desc: "Create a contract from template" },
          { method: "GET", path: "/api/v1/contracts/{id}", desc: "Get contract detail" },
          { method: "PATCH", path: "/api/v1/contracts/{id}", desc: "Update a contract" },
          { method: "DELETE", path: "/api/v1/contracts/{id}", desc: "Delete a contract" },
        ]}
        createFields="templateId (required), jobId (required), customerId (required)"
      />
      <div className="mt-8 border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Me</h3>
        <p className="text-gray-600 text-sm mb-4">Get information about the authenticated user and company.</p>
        <div className="space-y-2">
          <EndpointRow method="GET" path="/api/v1/me" desc="Get user and company info" />
        </div>
      </div>
    </Section>
  )
}
