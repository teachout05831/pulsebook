import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

const PAGE_FIELDS = "id, company_id, estimate_id, template_id, public_token, is_active, expires_at, sections, design_theme, brand_overrides, allow_video_call, allow_scheduling, allow_chat, allow_instant_approval, require_deposit, deposit_amount, deposit_type, payment_plans, incentive_config, approved_incentive_tier, status, published_at, first_viewed_at, last_viewed_at, approved_at, declined_at, created_by, created_at, updated_at";

function transformPage(p: Record<string, unknown>) {
  return {
    id: p.id,
    companyId: p.company_id,
    estimateId: p.estimate_id,
    templateId: p.template_id || null,
    publicToken: p.public_token,
    isActive: p.is_active,
    expiresAt: p.expires_at || null,
    sections: p.sections || [],
    designTheme: p.design_theme || {},
    brandOverrides: p.brand_overrides || null,
    allowVideoCall: p.allow_video_call,
    allowScheduling: p.allow_scheduling,
    allowChat: p.allow_chat,
    allowInstantApproval: p.allow_instant_approval,
    requireDeposit: p.require_deposit,
    depositAmount: p.deposit_amount || null,
    depositType: p.deposit_type || "flat",
    paymentPlans: p.payment_plans || null,
    incentiveConfig: p.incentive_config || null,
    approvedIncentiveTier: p.approved_incentive_tier || null,
    status: p.status,
    publishedAt: p.published_at || null,
    firstViewedAt: p.first_viewed_at || null,
    lastViewedAt: p.last_viewed_at || null,
    approvedAt: p.approved_at || null,
    declinedAt: p.declined_at || null,
    createdBy: p.created_by || null,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

// GET /api/estimate-pages - List estimate pages
export async function GET(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("_page") || "1", 10);
    const limit = parseInt(searchParams.get("_limit") || "10", 10);
    const status = searchParams.get("status") || "";
    const offset = (page - 1) * limit;

    let query = supabase
      .from("estimate_pages")
      .select(`${PAGE_FIELDS}, estimates(estimate_number, total, customers(name))`, { count: "exact" })
      .eq("company_id", companyId);

    if (status) {
      query = query.eq("status", status);
    }

    query = query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: "Failed to fetch estimate pages" }, { status: 500 });
    }

    const pages = (data || []).map((p) => {
      const estimate = Array.isArray(p.estimates) ? p.estimates[0] : p.estimates;
      const customer = estimate?.customers
        ? (Array.isArray(estimate.customers) ? estimate.customers[0] : estimate.customers)
        : null;

      return {
        ...transformPage(p),
        estimateNumber: estimate?.estimate_number || "",
        estimateTotal: estimate?.total || 0,
        customerName: customer?.name || "",
      };
    });

    return NextResponse.json({ data: pages, total: count || 0 }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST /api/estimate-pages - Create an estimate page
export async function POST(request: NextRequest) {
  try {
    const { user, companyId, supabase } = await getAuthCompany();

    const body = await request.json();

    if (!body.estimateId) {
      return NextResponse.json({ error: "Estimate ID is required" }, { status: 400 });
    }

    // Verify estimate belongs to this company
    const { data: estimate } = await supabase
      .from("estimates")
      .select("id")
      .eq("id", body.estimateId)
      .eq("company_id", companyId)
      .single();

    if (!estimate) {
      return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
    }

    // Generate unique token
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let publicToken = "";
    for (let i = 0; i < 12; i++) {
      publicToken += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Default sections
    const defaultSections = body.sections || [
      { id: crypto.randomUUID(), type: "hero", order: 1, visible: true, settings: { variant: "clean" }, content: {} },
      { id: crypto.randomUUID(), type: "scope", order: 2, visible: true, settings: { variant: "checklist" }, content: {} },
      { id: crypto.randomUUID(), type: "pricing", order: 3, visible: true, settings: { variant: "detailed" }, content: { useEstimateLineItems: true } },
      { id: crypto.randomUUID(), type: "approval", order: 4, visible: true, settings: {}, content: {} },
      { id: crypto.randomUUID(), type: "contact", order: 5, visible: true, settings: {}, content: {} },
    ];

    const { data, error } = await supabase
      .from("estimate_pages")
      .insert({
        company_id: companyId,
        estimate_id: body.estimateId,
        template_id: body.templateId ?? null,
        public_token: publicToken,
        sections: defaultSections,
        design_theme: body.designTheme ?? {},
        incentive_config: body.incentiveConfig ? { ...body.incentiveConfig, tiers: (body.incentiveConfig.tiers || []).map((t: Record<string, unknown>) => ({ ...t, deadline: null })) } : null,
        status: "draft",
        created_by: user.id,
      })
      .select(PAGE_FIELDS)
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to create estimate page" }, { status: 500 });
    }

    return NextResponse.json({ data: transformPage(data) }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
