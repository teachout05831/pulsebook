import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { geocodeAndStoreCoords } from "@/lib/geocode-job";
import { calculateTotals } from "@/features/estimates/utils/calculateTotals";
import { autoAttachContracts } from "@/features/contracts/utils/autoAttachContracts";
import { logActivity } from "@/features/activity/utils/logActivity";

const ALLOWED_SORTS_JOBS = ["scheduled_date", "created_at", "updated_at", "title", "status"];

// Lean select for list view — only columns the UI actually needs
const JOB_LIST_FIELDS = "id, company_id, customer_id, title, status, scheduled_date, scheduled_time, address, assigned_to, assigned_crew_id, tags, total, created_at, updated_at";

// Full select for POST response
const JOB_DETAIL_FIELDS = "id, company_id, customer_id, title, description, status, scheduled_date, scheduled_time, arrival_window, estimated_duration, address, assigned_to, assigned_crew_id, dispatched_at, notes, custom_fields, tags, is_recurring_template, recurrence_config, parent_job_id, instance_date, line_items, pricing_model, resources, subtotal, tax_rate, tax_amount, total, deposit_type, deposit_amount, deposit_paid, applied_fees, source_estimate_id, internal_notes, customer_notes, crew_notes, crew_feedback, latitude, longitude, created_at, updated_at";

function escapeLike(s: string): string {
  return s.replace(/[%_\\]/g, "\\$&");
}

// Lean converter for list view — only what the table UI renders
function convertJobList(j: Record<string, unknown>) {
  const customer = Array.isArray(j.customers) ? j.customers[0] : j.customers;
  return {
    id: j.id, companyId: j.company_id, customerId: j.customer_id,
    customerName: (customer as Record<string, unknown>)?.name || "",
    title: j.title, status: j.status,
    scheduledDate: j.scheduled_date, scheduledTime: j.scheduled_time,
    address: j.address, assignedTo: j.assigned_to,
    assignedCrewId: j.assigned_crew_id || null, tags: j.tags || [],
    total: (j.total as number) || 0,
    createdAt: j.created_at, updatedAt: j.updated_at,
  };
}

// Full converter for detail/create responses
function convertJob(j: Record<string, unknown>) {
  const customer = Array.isArray(j.customers) ? j.customers[0] : j.customers;
  return {
    id: j.id, companyId: j.company_id, customerId: j.customer_id,
    customerName: (customer as Record<string, unknown>)?.name || "",
    title: j.title, description: j.description, status: j.status,
    scheduledDate: j.scheduled_date, scheduledTime: j.scheduled_time,
    arrivalWindow: j.arrival_window || null, estimatedDuration: j.estimated_duration, address: j.address,
    assignedTo: j.assigned_to, assignedCrewId: j.assigned_crew_id || null,
    dispatchedAt: j.dispatched_at || null, notes: j.notes,
    customFields: j.custom_fields || {}, tags: j.tags || [],
    isRecurringTemplate: j.is_recurring_template || false,
    recurrenceConfig: j.recurrence_config || null,
    parentJobId: j.parent_job_id || null, instanceDate: j.instance_date || null,
    lineItems: j.line_items || [], pricingModel: j.pricing_model || "flat",
    resources: j.resources || {}, subtotal: j.subtotal || 0,
    taxRate: j.tax_rate || 0, taxAmount: j.tax_amount || 0, total: j.total || 0,
    depositType: j.deposit_type || null, depositAmount: j.deposit_amount || 0,
    depositPaid: j.deposit_paid || 0, appliedFees: j.applied_fees || [],
    sourceEstimateId: j.source_estimate_id || null,
    internalNotes: j.internal_notes || null, customerNotes: j.customer_notes || null,
    crewNotes: j.crew_notes || null, crewFeedback: j.crew_feedback || null,
    latitude: j.latitude || null, longitude: j.longitude || null,
    createdAt: j.created_at, updatedAt: j.updated_at,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get("_page") || "1", 10);
    const limit = parseInt(searchParams.get("_limit") || "10", 10);
    const offset = (page - 1) * limit;
    const rawSort = searchParams.get("_sort") || "scheduled_date";
    const sortField = ALLOWED_SORTS_JOBS.includes(rawSort) ? rawSort : "scheduled_date";
    const sortOrder = searchParams.get("_order") || "desc";
    const searchQuery = searchParams.get("q");
    const statusFilter = searchParams.get("status");
    const customerIdFilter = searchParams.get("customerId");

    let query = supabase
      .from("jobs")
      .select(`${JOB_LIST_FIELDS}, customers(name)`, { count: "exact" })
      .eq("company_id", companyId);

    if (searchQuery) {
      const safe = escapeLike(searchQuery);
      query = query.or(`title.ilike.%${safe}%,address.ilike.%${safe}%`);
    }
    if (statusFilter) query = query.eq("status", statusFilter);
    if (customerIdFilter) query = query.eq("customer_id", customerIdFilter);
    query = query.order(sortField, { ascending: sortOrder === "asc" });
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    if (error) {
      console.error("Jobs list query error:", error.message, error.code);
      return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
    }

    const jobs = (data || []).map((j) => convertJobList(j as Record<string, unknown>));

    return NextResponse.json(
      { data: jobs, total: count || 0 },
      { headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" } }
    );
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.statusCode });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { companyId, user, supabase } = await getAuthCompany();
    const body = await request.json();

    if (!body.title || body.title.length < 2) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (body.customerId) {
      const { data: customer } = await supabase
        .from("customers").select("company_id").eq("id", body.customerId).single();
      if (!customer || customer.company_id !== companyId) {
        return NextResponse.json({ error: "Customer not found" }, { status: 404 });
      }
    }

    // Calculate totals if pricing data provided
    let subtotal = 0, taxAmount = 0, total = 0;
    if (body.lineItems || body.resources || body.pricingModel) {
      const result = calculateTotals({
        lineItems: body.lineItems || [],
        resources: body.resources || {},
        pricingModel: body.pricingModel || "flat",
        taxRate: body.taxRate || 0,
        depositType: (body.depositType || null) as "percentage" | "fixed" | null,
        depositValue: body.depositAmount || 0,
        depositPaid: 0,
        appliedFees: body.appliedFees || [],
      });
      subtotal = result.subtotal;
      taxAmount = result.taxAmount;
      total = result.total;
    }

    const { data, error } = await supabase
      .from("jobs")
      .insert({
        company_id: companyId,
        customer_id: body.customerId || null,
        title: body.title,
        description: body.description || null,
        status: body.status || "scheduled",
        scheduled_date: body.scheduledDate || new Date().toISOString().split("T")[0],
        scheduled_time: body.scheduledTime || null,
        arrival_window: body.arrivalWindow || null,
        estimated_duration: body.estimatedDuration || null,
        address: body.address || null,
        assigned_to: body.assignedTo || null,
        assigned_crew_id: body.assignedCrewId || null,
        notes: body.notes || null,
        custom_fields: body.customFields || {},
        tags: body.tags || [],
        is_recurring_template: body.isRecurringTemplate || false,
        recurrence_config: body.recurrenceConfig || null,
        line_items: body.lineItems || [],
        pricing_model: body.pricingModel || "flat",
        resources: body.resources || {},
        subtotal,
        tax_rate: body.taxRate || 0,
        tax_amount: taxAmount,
        total,
        deposit_type: body.depositType || null,
        deposit_amount: body.depositAmount || 0,
        deposit_paid: 0,
        applied_fees: body.appliedFees || [],
        source_estimate_id: body.sourceEstimateId || null,
        internal_notes: body.internalNotes || null,
        customer_notes: body.customerNotes || null,
        crew_notes: body.crewNotes || null,
        crew_feedback: null,
      })
      .select(`${JOB_DETAIL_FIELDS}, customers(name)`)
      .single();

    if (error) return NextResponse.json({ error: "Failed to create job" }, { status: 500 });

    if (data.address) {
      geocodeAndStoreCoords(supabase, data.id, data.address);
    }

    // Log activity (fire-and-forget)
    const custObj = Array.isArray(data.customers) ? data.customers[0] : data.customers;
    const custName = (custObj as Record<string, unknown>)?.name as string || null;
    logActivity(supabase, {
      companyId, entityType: "job", entityId: data.id,
      action: "created",
      description: `New job <strong>${data.title}</strong> created`,
      customerId: data.customer_id || null, customerName: custName,
      category: "system", amount: total || null,
      metadata: { status: data.status, title: data.title },
      performedBy: user.id,
    });

    // Fire-and-forget: auto-attach contracts
    autoAttachContracts(supabase, {
      companyId, entityType: "job", entityId: data.id,
      customerId: data.customer_id || null, pricingModel: data.pricing_model || "flat", userId: user.id,
    });

    return NextResponse.json({ data: convertJob(data as Record<string, unknown>) }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.statusCode });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
