import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { syncUniversalBlocks } from "@/lib/utils/syncUniversalBlocks";
import { calculateTotals } from "@/features/estimates/utils/calculateTotals";

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

// GET /api/estimate-pages/[id] - Get a single estimate page
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    const { data, error } = await supabase
      .from("estimate_pages")
      .select(`${PAGE_FIELDS}, estimates(estimate_number, customer_id, line_items, tax_rate, pricing_model, resources, deposit_type, deposit_amount, deposit_paid, applied_fees, customer_notes, customers(name, email, phone))`)
      .eq("id", id)
      .eq("company_id", companyId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    if (data.sections) {
      data.sections = await syncUniversalBlocks(data.sections as any[], companyId);
    }

    const estimate = Array.isArray(data.estimates) ? data.estimates[0] : data.estimates;
    const customer = estimate?.customers
      ? (Array.isArray(estimate.customers) ? estimate.customers[0] : estimate.customers)
      : null;

    // Calculate totals from line items and resources
    let totals = null;
    if (estimate) {
      totals = calculateTotals({
        lineItems: estimate.line_items || [],
        resources: estimate.resources || {},
        pricingModel: estimate.pricing_model || "flat",
        taxRate: estimate.tax_rate || 0,
        depositType: estimate.deposit_type as "percentage" | "fixed" | null,
        depositValue: estimate.deposit_amount || 0,
        depositPaid: estimate.deposit_paid || 0,
        appliedFees: estimate.applied_fees || [],
      });
    }

    return NextResponse.json({
      data: {
        ...transformPage(data),
        estimate: estimate ? {
          estimateNumber: estimate.estimate_number,
          total: totals?.total || 0,
          customerId: estimate.customer_id,
          lineItems: estimate.line_items || [],
          subtotal: totals?.subtotal || 0,
          taxRate: estimate.tax_rate || 0,
          taxAmount: totals?.taxAmount || 0,
          pricingModel: estimate.pricing_model,
          resources: estimate.resources || {},
          customerNotes: estimate.customer_notes || "",
        } : null,
        customer: customer ? {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        } : null,
      },
    }, {
      headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PATCH /api/estimate-pages/[id] - Update an estimate page
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    // Ownership check + get status/published_at for deadline resolution
    const { data: existing } = await supabase
      .from("estimate_pages")
      .select("id, status, published_at")
      .eq("id", id)
      .eq("company_id", companyId)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const body = await request.json();

    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.sections !== undefined) payload.sections = body.sections;
    if (body.designTheme !== undefined) payload.design_theme = body.designTheme;
    if (body.brandOverrides !== undefined) payload.brand_overrides = body.brandOverrides;
    if (body.allowVideoCall !== undefined) payload.allow_video_call = body.allowVideoCall;
    if (body.allowScheduling !== undefined) payload.allow_scheduling = body.allowScheduling;
    if (body.allowChat !== undefined) payload.allow_chat = body.allowChat;
    if (body.allowInstantApproval !== undefined) payload.allow_instant_approval = body.allowInstantApproval;
    if (body.requireDeposit !== undefined) payload.require_deposit = body.requireDeposit;
    if (body.depositAmount !== undefined) payload.deposit_amount = body.depositAmount;
    if (body.depositType !== undefined) payload.deposit_type = body.depositType;
    if (body.paymentPlans !== undefined) payload.payment_plans = body.paymentPlans;
    if (body.incentiveConfig !== undefined) {
      let config = body.incentiveConfig;
      // Resolve deadlines if page is already published
      if (config?.enabled && config?.tiers?.length > 0 && existing.published_at) {
        const publishMs = new Date(existing.published_at as string).getTime();
        config = {
          ...config,
          tiers: config.tiers.map((tier: Record<string, unknown>) => ({
            ...tier,
            deadline: tier.deadlineMode === "relative" && tier.relativeHours != null
              ? new Date(publishMs + (tier.relativeHours as number) * 3_600_000).toISOString()
              : tier.absoluteDeadline || tier.deadline || null,
          })),
        };
      }
      payload.incentive_config = config;
    }
    if (body.expiresAt !== undefined) payload.expires_at = body.expiresAt;

    const { data, error } = await supabase
      .from("estimate_pages")
      .update(payload)
      .eq("id", id)
      .select(PAGE_FIELDS)
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update page" }, { status: 500 });
    }

    return NextResponse.json({ data: transformPage(data) });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// DELETE /api/estimate-pages/[id] - Delete an estimate page
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    const { error } = await supabase
      .from("estimate_pages")
      .delete()
      .eq("id", id)
      .eq("company_id", companyId);

    if (error) {
      return NextResponse.json({ error: "Failed to delete page" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
