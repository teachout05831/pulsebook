import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { geocodeAndStoreCoords } from "@/lib/geocode-job";
import { calculateTotals } from "@/features/estimates/utils/calculateTotals";
import { deductPackageVisit } from "@/lib/prepaid-packages/deductPackageVisit";
import { logActivity } from "@/features/activity/utils/logActivity";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const JOB_FIELDS = "id, company_id, customer_id, title, description, status, scheduled_date, scheduled_time, arrival_window, estimated_duration, address, assigned_to, assigned_crew_id, dispatched_at, notes, custom_fields, tags, is_recurring_template, recurrence_config, parent_job_id, instance_date, line_items, pricing_model, resources, subtotal, tax_rate, tax_amount, total, deposit_type, deposit_amount, deposit_paid, applied_fees, source_estimate_id, internal_notes, customer_notes, crew_notes, crew_feedback, latitude, longitude, created_at, updated_at";

function convertJob(data: Record<string, unknown>) {
  const customer = Array.isArray(data.customers) ? data.customers[0] : data.customers;
  return {
    id: data.id, companyId: data.company_id, customerId: data.customer_id,
    customerName: (customer as Record<string, unknown>)?.name || null,
    title: data.title, description: data.description, status: data.status,
    scheduledDate: data.scheduled_date, scheduledTime: data.scheduled_time,
    arrivalWindow: data.arrival_window || null, estimatedDuration: data.estimated_duration, address: data.address,
    assignedTo: data.assigned_to, assignedCrewId: data.assigned_crew_id || null,
    dispatchedAt: data.dispatched_at || null, notes: data.notes,
    customFields: data.custom_fields || {}, tags: data.tags || [],
    isRecurringTemplate: data.is_recurring_template || false,
    recurrenceConfig: data.recurrence_config || null,
    parentJobId: data.parent_job_id || null, instanceDate: data.instance_date || null,
    lineItems: data.line_items || [], pricingModel: data.pricing_model || "flat",
    resources: data.resources || { trucks: null, teamSize: null, estimatedHours: null, hourlyRate: null, customFields: {} },
    subtotal: data.subtotal || 0, taxRate: data.tax_rate || 0,
    taxAmount: data.tax_amount || 0, total: data.total || 0,
    depositType: data.deposit_type || null, depositAmount: data.deposit_amount || 0,
    depositPaid: data.deposit_paid || 0, appliedFees: data.applied_fees || [],
    sourceEstimateId: data.source_estimate_id || null,
    internalNotes: data.internal_notes || null, customerNotes: data.customer_notes || null,
    crewNotes: data.crew_notes || null, crewFeedback: data.crew_feedback || null,
    latitude: data.latitude || null, longitude: data.longitude || null,
    createdAt: data.created_at, updatedAt: data.updated_at,
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();
    const { data, error } = await supabase
      .from("jobs").select(`${JOB_FIELDS}, customers(name)`)
      .eq("id", id).eq("company_id", companyId).single();
    if (error || !data) return NextResponse.json({ message: "Job not found" }, { status: 404 });
    return NextResponse.json({ data: convertJob(data as Record<string, unknown>) }, {
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
    const body = await request.json();
    const { companyId, user, supabase } = await getAuthCompany();

    // Verify ownership + fetch pricing fields for recalc
    const { data: existing } = await supabase.from("jobs")
      .select("company_id, status, customer_id, line_items, pricing_model, resources, tax_rate, deposit_type, deposit_amount, deposit_paid, applied_fees")
      .eq("id", id).single();
    if (!existing) return NextResponse.json({ message: "Job not found" }, { status: 404 });
    if (existing.company_id !== companyId) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    const u: Record<string, unknown> = {};
    if (body.customerId !== undefined) u.customer_id = body.customerId;
    if (body.title !== undefined) u.title = body.title;
    if (body.description !== undefined) u.description = body.description;
    if (body.status !== undefined) u.status = body.status;
    if (body.scheduledDate !== undefined) u.scheduled_date = body.scheduledDate;
    if (body.scheduledTime !== undefined) u.scheduled_time = body.scheduledTime;
    if (body.arrivalWindow !== undefined) u.arrival_window = body.arrivalWindow;
    if (body.estimatedDuration !== undefined) u.estimated_duration = body.estimatedDuration;
    if (body.address !== undefined) u.address = body.address;
    if (body.assignedTo !== undefined) u.assigned_to = body.assignedTo;
    if (body.assignedCrewId !== undefined) u.assigned_crew_id = body.assignedCrewId;
    if (body.notes !== undefined) u.notes = body.notes;
    if (body.customFields !== undefined) u.custom_fields = body.customFields;
    if (body.tags !== undefined) u.tags = body.tags;
    if (body.isRecurringTemplate !== undefined) u.is_recurring_template = body.isRecurringTemplate;
    if (body.recurrenceConfig !== undefined) u.recurrence_config = body.recurrenceConfig;
    if (body.lineItems !== undefined) u.line_items = body.lineItems;
    if (body.pricingModel !== undefined) u.pricing_model = body.pricingModel;
    if (body.resources !== undefined) u.resources = body.resources;
    if (body.depositType !== undefined) u.deposit_type = body.depositType;
    if (body.depositAmount !== undefined) u.deposit_amount = body.depositAmount;
    if (body.appliedFees !== undefined) u.applied_fees = body.appliedFees;
    if (body.internalNotes !== undefined) u.internal_notes = body.internalNotes;
    if (body.customerNotes !== undefined) u.customer_notes = body.customerNotes;
    if (body.crewNotes !== undefined) u.crew_notes = body.crewNotes;
    if (body.crewFeedback !== undefined) u.crew_feedback = body.crewFeedback;
    if (body.sourceEstimateId !== undefined) u.source_estimate_id = body.sourceEstimateId;

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

    const { data, error } = await supabase.from("jobs").update(u).eq("id", id)
      .select(`${JOB_FIELDS}, customers(name)`).single();
    if (error) return NextResponse.json({ error: "Failed to update job" }, { status: 500 });

    // Log activity (fire-and-forget)
    const { data: profile } = await supabase.from("users").select("full_name").eq("id", user.id).limit(1).single();
    const actorName = (profile as Record<string, unknown>)?.full_name as string || "Admin";
    const custObj = Array.isArray(data.customers) ? data.customers[0] : data.customers;
    const custName = (custObj as Record<string, unknown>)?.name as string || null;
    const activityBase = {
      companyId, entityType: "job" as const, entityId: id,
      performedBy: user.id, performedByName: actorName,
      customerId: existing.customer_id || null, customerName: custName,
      amount: (data as Record<string, unknown>).total as number || null,
    };
    const jobTitle = (data as Record<string, unknown>).title as string || "Untitled";
    if (body.status !== undefined) {
      logActivity(supabase, {
        ...activityBase,
        action: "status_changed",
        description: `Job <strong>${jobTitle}</strong> changed to <strong>${body.status}</strong>`,
        metadata: { oldStatus: existing.status, newStatus: body.status },
      });
    } else {
      const FIELD_LABELS: Record<string, string> = {
        title: "title", assignedTo: "assignment", assignedCrewId: "crew",
        scheduledDate: "schedule", lineItems: "line items", pricingModel: "pricing",
        address: "address", tags: "tags",
      };
      const notable = Object.keys(body).filter((k) => k in FIELD_LABELS);
      if (notable.length > 0) {
        const changed = notable.map((k) => FIELD_LABELS[k]).join(", ");
        logActivity(supabase, {
          ...activityBase,
          action: "updated",
          description: `Job <strong>${jobTitle}</strong> updated — ${changed}`,
          metadata: { fields: notable },
        });
      }
    }

    // Fire-and-forget: auto-deduct package visit on job completion
    if (body.status === "completed" && existing.status !== "completed" && existing.customer_id) {
      deductPackageVisit(supabase, companyId, existing.customer_id as string, id);
    }

    // Fire-and-forget: re-geocode if address changed
    if (body.address !== undefined && data.address) {
      geocodeAndStoreCoords(supabase, id, data.address);
    }

    return NextResponse.json({ data: convertJob(data as Record<string, unknown>) });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.statusCode });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();
    const { data: existing } = await supabase.from("jobs").select("company_id").eq("id", id).single();
    if (!existing) return NextResponse.json({ message: "Job not found" }, { status: 404 });
    if (existing.company_id !== companyId) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    const { error } = await supabase.from("jobs").delete().eq("id", id);
    if (error) return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
    return NextResponse.json({ data: { id } });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.statusCode });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
