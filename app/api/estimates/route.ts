import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { autoAttachContracts } from "@/features/contracts/utils/autoAttachContracts";
import { logActivity } from "@/features/activity/utils/logActivity";
import { convertEstimateList } from "./convertEstimate";

const ESTIMATE_FIELDS = "id, company_id, customer_id, estimate_number, status, pricing_model, binding_type, source, lead_status, service_type, sales_person_id, estimator_id, tags, scheduled_date, scheduled_time, issue_date, expiry_date, line_items, subtotal, tax_rate, tax_amount, total, notes, terms, address, internal_notes, customer_notes, crew_notes, crew_feedback, resources, deposit_type, deposit_amount, deposit_paid, custom_fields, applied_fees, job_id, assigned_crew_id, technician_id, created_at, updated_at";

// GET /api/estimates - List estimates with pagination, search, and filtering
export async function GET(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("_page") || "1", 10);
    const limit = parseInt(searchParams.get("_limit") || "10", 10);
    const search = searchParams.get("q") || "";
    const status = searchParams.get("status") || "";
    const customerId = searchParams.get("customerId") || "";
    const offset = (page - 1) * limit;

    // Build query with customer + estimate_pages join
    let query = supabase
      .from("estimates")
      .select(`${ESTIMATE_FIELDS}, customers(name, email, phone), estimate_pages(id, status, public_token)`, { count: "exact" })
      .eq("company_id", companyId);

    // Search filter
    if (search) {
      query = query.or(`estimate_number.ilike.%${search}%`);
    }

    // Status filter
    if (status) {
      query = query.eq("status", status);
    }

    // Customer filter
    if (customerId) {
      query = query.eq("customer_id", customerId);
    }

    // Sort and paginate
    query = query
      .order("issue_date", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: "Failed to fetch estimates" }, { status: 500 });
    }

    // Transform to camelCase
    const estimates = (data || []).map((e) => convertEstimateList(e as Record<string, unknown>));

    return NextResponse.json(
      { data: estimates, total: count || 0 },
      { headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" } }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST /api/estimates - Create a new estimate
export async function POST(request: NextRequest) {
  try {
    const { companyId, user, supabase } = await getAuthCompany();

    const body = await request.json();

    // Ownership check: verify customer belongs to this company
    if (body.customerId) {
      const { data: customer } = await supabase
        .from("customers")
        .select("company_id")
        .eq("id", body.customerId)
        .single();

      if (!customer || customer.company_id !== companyId) {
        return NextResponse.json({ error: "Customer not found" }, { status: 404 });
      }
    }

    // Generate estimate number
    const { data: lastEstimate } = await supabase
      .from("estimates")
      .select("estimate_number")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    let nextNum = 1;
    if (lastEstimate?.estimate_number) {
      const match = lastEstimate.estimate_number.match(/EST-(\d+)/);
      if (match) nextNum = parseInt(match[1], 10) + 1;
    }
    const estimateNumber = `EST-${String(nextNum).padStart(3, "0")}`;

    // Validate and recalculate line item totals
    const lineItems = (body.lineItems || []).map((item: Record<string, unknown>) => ({
      ...item,
      quantity: Math.max(0, Number(item.quantity) || 0),
      unitPrice: Math.max(0, Number(item.unitPrice) || 0),
      total: Math.max(0, Number(item.quantity) || 0) * Math.max(0, Number(item.unitPrice) || 0),
    }));
    const subtotal = lineItems.reduce((sum: number, item: { total: number }) => sum + item.total, 0);
    const taxRate = Math.min(100, Math.max(0, body.taxRate ?? 8));
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    const { data, error } = await supabase
      .from("estimates")
      .insert({
        company_id: companyId,
        customer_id: body.customerId,
        estimate_number: estimateNumber,
        status: body.status || "draft",
        pricing_model: body.pricingModel || "flat",
        binding_type: body.bindingType || "non_binding",
        source: body.source || null,
        service_type: body.serviceType || null,
        issue_date: body.issueDate || new Date().toISOString().split("T")[0],
        expiry_date: body.expiryDate || null,
        line_items: lineItems,
        subtotal,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total,
        notes: body.notes || null,
        terms: body.terms || null,
        address: body.address || null,
        resources: body.resources || {},
        internal_notes: body.internalNotes || null,
        customer_notes: body.customerNotes || null,
      })
      .select(`${ESTIMATE_FIELDS}, customers(name, email, phone)`)
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to create estimate" }, { status: 500 });
    }

    const estimate = convertEstimateList(data as Record<string, unknown>);

    // Log activity (fire-and-forget)
    const custObj = Array.isArray(data.customers) ? data.customers[0] : data.customers;
    const custName = (custObj as Record<string, unknown>)?.name as string || null;
    logActivity(supabase, {
      companyId, entityType: "estimate", entityId: data.id,
      action: "created",
      description: `Estimate <strong>${estimateNumber}</strong> created`,
      customerId: data.customer_id || null, customerName: custName,
      category: "system", amount: total || null,
      metadata: { estimateNumber, status: data.status },
      performedBy: user.id,
    });

    // Fire-and-forget: auto-attach contracts
    autoAttachContracts(supabase, {
      companyId, entityType: "estimate", entityId: data.id,
      customerId: data.customer_id || null, pricingModel: data.pricing_model || "flat", userId: user.id,
    });

    return NextResponse.json({ data: estimate }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
