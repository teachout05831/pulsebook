import type { EstimateDetail } from "@/types/estimate";

export function convertEstimateDetail(d: Record<string, unknown>): EstimateDetail {
  const customer = Array.isArray(d.customers) ? d.customers[0] : d.customers;
  const epArr = (Array.isArray(d.estimate_pages) ? d.estimate_pages : []) as Record<string, unknown>[];
  const locsArr = (Array.isArray(d.estimate_locations) ? d.estimate_locations : []) as Record<string, unknown>[];
  const tasksArr = (Array.isArray(d.estimate_tasks) ? d.estimate_tasks : []) as Record<string, unknown>[];

  return {
    id: d.id as string, companyId: d.company_id as string, customerId: d.customer_id as string,
    customerName: ((customer as Record<string, unknown>)?.name as string) || "",
    customerEmail: ((customer as Record<string, unknown>)?.email as string) || null,
    customerPhone: ((customer as Record<string, unknown>)?.phone as string) || null,
    estimateNumber: d.estimate_number as string, status: d.status as EstimateDetail["status"],
    pricingModel: (d.pricing_model as EstimateDetail["pricingModel"]) || "flat",
    bindingType: (d.binding_type as EstimateDetail["bindingType"]) || "non_binding",
    source: d.source as string | null, leadStatus: d.lead_status as string | null,
    serviceType: d.service_type as string | null,
    salesPersonId: d.sales_person_id as string | null, salesPersonName: null,
    estimatorId: d.estimator_id as string | null, estimatorName: null,
    tags: (d.tags as string[]) || [], scheduledDate: d.scheduled_date as string | null,
    scheduledTime: d.scheduled_time as string | null,
    issueDate: d.issue_date as string, expiryDate: d.expiry_date as string | null,
    lineItems: (d.line_items as EstimateDetail["lineItems"]) || [],
    subtotal: d.subtotal as number, taxRate: d.tax_rate as number,
    taxAmount: d.tax_amount as number, total: d.total as number,
    notes: d.notes as string | null, terms: d.terms as string | null, address: d.address as string | null,
    internalNotes: d.internal_notes as string | null, customerNotes: d.customer_notes as string | null,
    crewNotes: d.crew_notes as string | null, crewFeedback: d.crew_feedback as string | null,
    resources: (d.resources as EstimateDetail["resources"]) || { trucks: null, teamSize: null, estimatedHours: null, hourlyRate: null, showEstimatedHours: false, minHours: null, maxHours: null, customFields: {} },
    depositType: d.deposit_type as EstimateDetail["depositType"],
    depositAmount: d.deposit_amount as number | null,
    depositPaid: (d.deposit_paid as number) || 0,
    customFields: (d.custom_fields as Record<string, unknown>) || {},
    appliedFees: (d.applied_fees as EstimateDetail["appliedFees"]) || [],
    jobId: (d.job_id as string) || null,
    assignedCrewId: (d.assigned_crew_id as string) || null,
    technicianId: (d.technician_id as string) || null,
    pageCount: epArr.length,
    pageStatus: epArr.length > 0 ? (epArr[0].status as string) : null,
    pageToken: epArr.length > 0 ? (epArr[0].public_token as string) : null,
    pageId: epArr.length > 0 ? (epArr[0].id as string) : null,
    estimatePages: epArr.map((p) => ({
      id: p.id as string, status: p.status as string, publicToken: p.public_token as string,
      publishedAt: (p.published_at as string) || null, firstViewedAt: (p.first_viewed_at as string) || null,
      approvedAt: (p.approved_at as string) || null,
    })),
    locations: locsArr.map((l) => ({
      id: l.id as string, estimateId: l.estimate_id as string,
      locationType: l.location_type as EstimateDetail["locations"][0]["locationType"],
      label: l.label as string | null, address: l.address as string,
      city: l.city as string | null, state: l.state as string | null, zip: l.zip as string | null,
      propertyType: l.property_type as string | null, accessNotes: l.access_notes as string | null,
      lat: (l.lat as number) || null, lng: (l.lng as number) || null, sortOrder: l.sort_order as number,
    })),
    tasks: tasksArr.map((t) => ({
      id: t.id as string, estimateId: t.estimate_id as string, title: t.title as string,
      completed: t.completed as boolean, dueDate: (t.due_date as string) || null,
      assignedTo: (t.assigned_to as string) || null, assignedName: null, sortOrder: t.sort_order as number,
    })),
    createdAt: d.created_at as string, updatedAt: d.updated_at as string,
  };
}
