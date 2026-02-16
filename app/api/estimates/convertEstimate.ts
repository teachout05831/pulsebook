// Shared snake_case → camelCase conversion for estimate API responses

type Row = Record<string, unknown>;

function convertBase(data: Row) {
  const customer = Array.isArray(data.customers) ? data.customers[0] : data.customers;
  const epArr = (Array.isArray(data.estimate_pages) ? data.estimate_pages : []) as Row[];
  return {
    base: {
      id: data.id, companyId: data.company_id, customerId: data.customer_id,
      customerName: (customer as Row)?.name || "",
      customerEmail: (customer as Row)?.email || null,
      customerPhone: (customer as Row)?.phone || null,
      estimateNumber: data.estimate_number, status: data.status,
      pricingModel: data.pricing_model || "flat", bindingType: data.binding_type || "non_binding",
      source: data.source, leadStatus: data.lead_status, serviceType: data.service_type,
      salesPersonId: data.sales_person_id, estimatorId: data.estimator_id,
      tags: data.tags || [], scheduledDate: data.scheduled_date, scheduledTime: data.scheduled_time,
      issueDate: data.issue_date, expiryDate: data.expiry_date,
      lineItems: data.line_items || [], subtotal: data.subtotal, taxRate: data.tax_rate,
      taxAmount: data.tax_amount, total: data.total, notes: data.notes, terms: data.terms,
      address: data.address, internalNotes: data.internal_notes, customerNotes: data.customer_notes,
      crewNotes: data.crew_notes, crewFeedback: data.crew_feedback,
      resources: data.resources || {},
      depositType: data.deposit_type, depositAmount: data.deposit_amount, depositPaid: data.deposit_paid || 0,
      customFields: data.custom_fields || {},
      appliedFees: data.applied_fees || [],
      pageCount: epArr.length,
      pageStatus: epArr.length > 0 ? epArr[0].status : null,
      pageToken: epArr.length > 0 ? epArr[0].public_token : null,
      pageId: epArr.length > 0 ? epArr[0].id : null,
      createdAt: data.created_at, updatedAt: data.updated_at,
    },
    epArr,
  };
}

/** For GET list and POST responses — no locations, tasks, or estimatePages array */
export function convertEstimateList(data: Row) {
  const { base } = convertBase(data);
  return base;
}

/** For GET/PATCH detail responses — includes estimatePages, locations, tasks, jobId */
export function convertEstimateDetail(data: Row) {
  const { base, epArr } = convertBase(data);
  const locsArr = (Array.isArray(data.estimate_locations) ? data.estimate_locations : []) as Row[];
  const tasksArr = (Array.isArray(data.estimate_tasks) ? data.estimate_tasks : []) as Row[];

  return {
    ...base,
    resources: data.resources || { trucks: null, teamSize: null, estimatedHours: null, hourlyRate: null, customFields: {} },
    jobId: (data.job_id as string) || null,
    assignedCrewId: (data.assigned_crew_id as string) || null,
    technicianId: (data.technician_id as string) || null,
    salesPersonName: null, estimatorName: null,
    estimatePages: epArr.map((p) => ({
      id: p.id, status: p.status, publicToken: p.public_token,
      publishedAt: p.published_at || null, firstViewedAt: p.first_viewed_at || null, approvedAt: p.approved_at || null,
    })),
    locations: locsArr.map((l) => ({
      id: l.id, estimateId: l.estimate_id, locationType: l.location_type, label: l.label,
      address: l.address, city: l.city, state: l.state, zip: l.zip,
      propertyType: l.property_type, accessNotes: l.access_notes,
      lat: l.lat || null, lng: l.lng || null, sortOrder: l.sort_order,
    })),
    tasks: tasksArr.map((t) => ({
      id: t.id, estimateId: t.estimate_id, title: t.title, completed: t.completed,
      dueDate: t.due_date, assignedTo: t.assigned_to, assignedName: null, sortOrder: t.sort_order,
    })),
  };
}
