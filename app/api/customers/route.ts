import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { logActivity } from "@/features/activity/utils/logActivity";

const ALLOWED_SORTS_CUSTOMERS = ["created_at", "updated_at", "name", "email", "status"];

function escapeLike(s: string): string {
  return s.replace(/[%_\\]/g, "\\$&");
}

export async function GET(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const searchParams = request.nextUrl.searchParams;

    // Parse pagination params
    const page = parseInt(searchParams.get("_page") || "1", 10);
    const limit = parseInt(searchParams.get("_limit") || "10", 10);
    const offset = (page - 1) * limit;

    // Parse sorting params - validate against allowlist
    const rawSort = searchParams.get("_sort") || "created_at";
    const sortField = ALLOWED_SORTS_CUSTOMERS.includes(rawSort) ? rawSort : "created_at";
    const sortOrder = searchParams.get("_order") || "desc";

    // Parse search/filter params
    const searchQuery = searchParams.get("q");
    const statusFilter = searchParams.get("status");
    const leadStatusFilter = searchParams.get("leadStatus");
    const leadStatusNotEq = searchParams.get("leadStatus_ne");
    const assignedToFilter = searchParams.get("assignedTo");
    const assignedToNull = searchParams.get("assignedTo_null");
    const sourceFilter = searchParams.get("source");
    const serviceDateNull = searchParams.get("serviceDate_null");

    // Build query - select all needed fields with explicit company_id filter
    let query = supabase
      .from("customers")
      .select("id, company_id, name, email, phone, address, notes, custom_fields, tags, status, lead_status, source, estimated_value, service_type, service_date, last_contact_date, assigned_to, created_at, updated_at", { count: "exact" })
      .eq("company_id", companyId);

    // Search filter - escape LIKE special chars
    if (searchQuery) {
      const safe = escapeLike(searchQuery);
      query = query.or(`name.ilike.%${safe}%,email.ilike.%${safe}%,phone.ilike.%${safe}%`);
    }

    // Status filter (active, inactive, lead)
    if (statusFilter) {
      query = query.eq("status", statusFilter);
    }

    // Lead status filter (new, contacted, qualified, proposal, won, lost)
    if (leadStatusFilter) {
      query = query.eq("lead_status", leadStatusFilter);
    }

    // Lead status NOT equal filter (for "My Leads" = not new)
    if (leadStatusNotEq) {
      query = query.neq("lead_status", leadStatusNotEq);
    }

    // Assigned to filter
    if (assignedToFilter) {
      query = query.eq("assigned_to", assignedToFilter);
    }

    // Unassigned filter (assigned_to IS NULL)
    if (assignedToNull === "true") {
      query = query.is("assigned_to", null);
    }

    // Source filter
    if (sourceFilter) {
      query = query.eq("source", sourceFilter);
    }

    // Job date TBD filter (service_date IS NULL)
    if (serviceDateNull === "true") {
      query = query.is("service_date", null);
    }

    // Sorting
    query = query.order(sortField, { ascending: sortOrder === "asc" });

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
    }

    // Batch-fetch balance data and latest estimate for this page of customers
    const customerIds = (data || []).map((c) => c.id);
    const balanceMap = new Map<string, number>();
    const latestEstimateMap = new Map<string, string>();
    if (customerIds.length > 0) {
      const [{ data: jobRows }, { data: paymentRows }, { data: estimateRows }] = await Promise.all([
        supabase.from("jobs").select("customer_id, total").in("customer_id", customerIds).eq("company_id", companyId).limit(1000),
        supabase.from("payments").select("customer_id, amount").in("customer_id", customerIds).eq("company_id", companyId).limit(1000),
        supabase.from("estimates").select("id, customer_id").in("customer_id", customerIds).eq("company_id", companyId).order("created_at", { ascending: false }).limit(500),
      ]);
      for (const j of jobRows || []) {
        balanceMap.set(j.customer_id, (balanceMap.get(j.customer_id) || 0) + (j.total || 0));
      }
      for (const p of paymentRows || []) {
        balanceMap.set(p.customer_id, (balanceMap.get(p.customer_id) || 0) - (p.amount || 0));
      }
      for (const e of estimateRows || []) {
        if (!latestEstimateMap.has(e.customer_id)) {
          latestEstimateMap.set(e.customer_id, e.id);
        }
      }
    }

    // Transform to camelCase for frontend
    const customers = (data || []).map(c => ({
      id: c.id,
      companyId: c.company_id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      address: c.address,
      notes: c.notes,
      customFields: c.custom_fields || {},
      tags: c.tags || [],
      status: c.status || "active",
      leadStatus: c.lead_status,
      source: c.source,
      estimatedValue: c.estimated_value,
      serviceType: c.service_type,
      serviceDate: c.service_date,
      lastContactDate: c.last_contact_date,
      assignedTo: c.assigned_to,
      accountBalance: Math.round((balanceMap.get(c.id) || 0) * 100) / 100,
      latestEstimateId: latestEstimateMap.get(c.id) || null,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
    }));

    return NextResponse.json(
      { data: customers, total: count || 0 },
      { headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" } }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const body = await request.json();

    // Validation
    if (!body.name || body.name.length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("customers")
      .insert({
        company_id: companyId,
        name: body.name,
        email: body.email || null,
        phone: body.phone || null,
        address: body.address || null,
        notes: body.notes || null,
        status: body.status || "active",
        lead_status: body.leadStatus || null,
        source: body.source || null,
        estimated_value: body.estimatedValue || null,
        service_type: body.serviceType || null,
        service_date: body.serviceDate || null,
        last_contact_date: body.lastContactDate || null,
        assigned_to: body.assignedTo || null,
        custom_fields: body.customFields || {},
        tags: body.tags || [],
      })
      .select("id, company_id, name, email, phone, address, notes, custom_fields, tags, status, lead_status, source, estimated_value, service_type, service_date, last_contact_date, assigned_to, created_at, updated_at")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
    }

    // Log activity (fire-and-forget)
    logActivity(supabase, {
      companyId, entityType: "customer", entityId: data.id,
      action: "created",
      description: `New ${data.status === "lead" ? "lead" : "customer"} <strong>${data.name}</strong> added`,
      customerId: data.id, customerName: data.name,
      category: "system",
      metadata: { status: data.status, source: data.source },
    });

    return NextResponse.json({
      data: {
        id: data.id,
        companyId: data.company_id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        notes: data.notes,
        customFields: data.custom_fields || {},
        tags: data.tags || [],
        status: data.status || "active",
        leadStatus: data.lead_status,
        source: data.source,
        estimatedValue: data.estimated_value,
        serviceType: data.service_type,
        serviceDate: data.service_date,
        lastContactDate: data.last_contact_date,
        assignedTo: data.assigned_to,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
