import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { calculateTotals } from "@/features/estimates/utils/calculateTotals";
import { logActivity } from "@/features/activity/utils/logActivity";
import { convertEstimateDetail } from "../convertEstimate";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const ESTIMATE_FIELDS = "id, company_id, customer_id, estimate_number, status, pricing_model, binding_type, source, lead_status, service_type, sales_person_id, estimator_id, tags, scheduled_date, scheduled_time, issue_date, expiry_date, line_items, subtotal, tax_rate, tax_amount, total, notes, terms, address, internal_notes, customer_notes, crew_notes, crew_feedback, resources, deposit_type, deposit_amount, deposit_paid, custom_fields, applied_fees, job_id, assigned_crew_id, technician_id, created_at, updated_at";

const JOINS = "customers(name, email, phone), estimate_pages(id, status, public_token, published_at, first_viewed_at, approved_at), estimate_locations(id, estimate_id, location_type, label, address, city, state, zip, property_type, access_notes, lat, lng, sort_order), estimate_tasks(id, estimate_id, title, completed, due_date, assigned_to, sort_order)";

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();
    const { data, error } = await supabase
      .from("estimates").select(`${ESTIMATE_FIELDS}, ${JOINS}`)
      .eq("id", id).eq("company_id", companyId).single();
    if (error || !data) return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
    return NextResponse.json({ data: convertEstimateDetail(data as Record<string, unknown>) }, {
      headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" }
    });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.statusCode });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { companyId, user, supabase } = await getAuthCompany();
    const { data: existing } = await supabase.from("estimates").select("company_id, subtotal, tax_rate, pricing_model, resources, line_items, deposit_type, deposit_amount, deposit_paid, applied_fees").eq("id", id).single();
    if (!existing) return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
    if (existing.company_id !== companyId) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    const body = await request.json();
    const u: Record<string, unknown> = {};
    if (body.customerId !== undefined) u.customer_id = body.customerId;
    if (body.status !== undefined) u.status = body.status;
    if (body.pricingModel !== undefined) u.pricing_model = body.pricingModel;
    if (body.bindingType !== undefined) u.binding_type = body.bindingType;
    if (body.source !== undefined) u.source = body.source;
    if (body.leadStatus !== undefined) u.lead_status = body.leadStatus;
    if (body.serviceType !== undefined) u.service_type = body.serviceType;
    if (body.salesPersonId !== undefined) u.sales_person_id = body.salesPersonId;
    if (body.estimatorId !== undefined) u.estimator_id = body.estimatorId;
    if (body.tags !== undefined) u.tags = body.tags;
    if (body.scheduledDate !== undefined) u.scheduled_date = body.scheduledDate;
    if (body.scheduledTime !== undefined) u.scheduled_time = body.scheduledTime;
    if (body.issueDate !== undefined) u.issue_date = body.issueDate;
    if (body.expiryDate !== undefined) u.expiry_date = body.expiryDate;
    if (body.notes !== undefined) u.notes = body.notes;
    if (body.terms !== undefined) u.terms = body.terms;
    if (body.address !== undefined) u.address = body.address;
    if (body.internalNotes !== undefined) u.internal_notes = body.internalNotes;
    if (body.customerNotes !== undefined) u.customer_notes = body.customerNotes;
    if (body.crewNotes !== undefined) u.crew_notes = body.crewNotes;
    if (body.crewFeedback !== undefined) u.crew_feedback = body.crewFeedback;
    if (body.resources !== undefined) u.resources = body.resources;
    if (body.lineItems !== undefined) u.line_items = body.lineItems;
    if (body.depositType !== undefined) u.deposit_type = body.depositType;
    if (body.depositAmount !== undefined) u.deposit_amount = body.depositAmount;
    if (body.customFields !== undefined) u.custom_fields = body.customFields;
    if (body.appliedFees !== undefined) u.applied_fees = body.appliedFees;
    if (body.jobId !== undefined) u.job_id = body.jobId;
    if (body.assignedCrewId !== undefined) u.assigned_crew_id = body.assignedCrewId;
    if (body.technicianId !== undefined) u.technician_id = body.technicianId;

    // Recalculate totals when pricing inputs change
    if (body.lineItems !== undefined || body.resources !== undefined || body.pricingModel !== undefined
      || body.taxRate !== undefined || body.depositType !== undefined || body.depositAmount !== undefined
      || body.appliedFees !== undefined) {
      const result = calculateTotals({
        lineItems: body.lineItems ?? existing.line_items ?? [],
        resources: body.resources ?? existing.resources ?? {},
        pricingModel: body.pricingModel ?? existing.pricing_model ?? "flat",
        taxRate: body.taxRate ?? existing.tax_rate ?? 0,
        depositType: (body.depositType ?? existing.deposit_type) as "percentage" | "fixed" | null,
        depositValue: body.depositAmount ?? existing.deposit_amount ?? 0,
        depositPaid: existing.deposit_paid ?? 0,
        appliedFees: body.appliedFees ?? existing.applied_fees ?? [],
      });
      u.subtotal = result.subtotal;
      u.tax_rate = body.taxRate ?? existing.tax_rate ?? 0;
      u.tax_amount = result.taxAmount;
      u.total = result.total;
    }

    const { data, error } = await supabase.from("estimates").update(u).eq("id", id)
      .select(`${ESTIMATE_FIELDS}, ${JOINS}`).single();
    if (error) return NextResponse.json({ error: "Failed to update" }, { status: 500 });

    // Log activity (fire-and-forget)
    const { data: profile } = await supabase.from("users").select("full_name").eq("id", user.id).limit(1).single();
    const actorName = (profile as Record<string, unknown>)?.full_name as string || "Admin";
    const custObj = Array.isArray(data.customers) ? data.customers[0] : data.customers;
    const custName = (custObj as Record<string, unknown>)?.name as string || null;
    const activityBase = {
      companyId, entityType: "estimate" as const, entityId: id,
      performedBy: user.id, performedByName: actorName,
      customerId: (data as Record<string, unknown>).customer_id as string || null,
      customerName: custName,
      amount: (data as Record<string, unknown>).total as number || null,
    };
    const estNum = (data as Record<string, unknown>).estimate_number as string || "Unknown";
    if (body.status !== undefined) {
      logActivity(supabase, {
        ...activityBase,
        action: "status_changed",
        description: `Estimate <strong>#${estNum}</strong> changed to <strong>${body.status}</strong>`,
        metadata: { newStatus: body.status },
      });
    } else {
      const FIELD_LABELS: Record<string, string> = {
        customerId: "customer", pricingModel: "pricing", bindingType: "binding type",
        lineItems: "line items", depositType: "deposit", depositAmount: "deposit",
        tags: "tags", address: "address", resources: "resources", appliedFees: "fees",
      };
      const notable = Object.keys(body).filter((k) => k in FIELD_LABELS);
      if (notable.length > 0) {
        const seen = new Set<string>();
        const changed = notable.map((k) => FIELD_LABELS[k]).filter((l) => { if (seen.has(l)) return false; seen.add(l); return true; }).join(", ");
        logActivity(supabase, {
          ...activityBase,
          action: "updated",
          description: `Estimate <strong>#${estNum}</strong> updated — ${changed}`,
          metadata: { fields: notable },
        });
      }
    }

    return NextResponse.json({ data: convertEstimateDetail(data as Record<string, unknown>) });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.statusCode });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();
    const { data: existing } = await supabase.from("estimates").select("company_id").eq("id", id).single();
    if (!existing) return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
    if (existing.company_id !== companyId) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    const { error } = await supabase.from("estimates").delete().eq("id", id);
    if (error) return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    return NextResponse.json({ data: { id } });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.statusCode });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
