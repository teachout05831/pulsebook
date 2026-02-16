import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  return withApiAuth(request, async ({ companyId, supabase }) => {
    const params = request.nextUrl.searchParams;
    const page = Math.max(1, Number(params.get("page")) || 1);
    const limit = Math.min(Math.max(1, Number(params.get("limit")) || 20), 100);
    const offset = (page - 1) * limit;
    const status = params.get("status") || "";
    const jobId = params.get("jobId") || "";
    const customerId = params.get("customerId") || "";

    let query = supabase
      .from("contract_instances")
      .select("id, template_id, job_id, customer_id, status, signing_token, sent_at, viewed_at, signed_at, paid_at, completed_at, created_at, updated_at", { count: "exact" })
      .eq("company_id", companyId);

    if (status) query = query.eq("status", status);
    if (jobId) query = query.eq("job_id", jobId);
    if (customerId) query = query.eq("customer_id", customerId);

    query = query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: "Failed to fetch contracts" }, { status: 500 });
    }

    return NextResponse.json({
      data: (data || []).map((c) => ({
        id: c.id, templateId: c.template_id,
        jobId: c.job_id, customerId: c.customer_id,
        status: c.status, signingToken: c.signing_token,
        sentAt: c.sent_at, viewedAt: c.viewed_at,
        signedAt: c.signed_at, paidAt: c.paid_at,
        completedAt: c.completed_at,
        createdAt: c.created_at, updatedAt: c.updated_at,
      })),
      pagination: { page, limit, total: count || 0 },
    }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  });
}

export async function POST(request: NextRequest) {
  return withApiAuth(request, async ({ companyId, userId, supabase }) => {
    const body = await request.json();

    if (!body.templateId) {
      return NextResponse.json({ error: "templateId is required" }, { status: 400 });
    }
    if (!body.jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }
    if (!body.customerId) {
      return NextResponse.json({ error: "customerId is required" }, { status: 400 });
    }

    // Verify template ownership
    const { data: template } = await supabase
      .from("contract_templates")
      .select("id, company_id, blocks, is_active")
      .eq("id", body.templateId)
      .single();

    if (!template || template.company_id !== companyId) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }
    if (!template.is_active) {
      return NextResponse.json({ error: "Template is not active" }, { status: 400 });
    }

    const signingToken = crypto.randomUUID();

    const { data, error } = await supabase
      .from("contract_instances")
      .insert({
        company_id: companyId, template_id: body.templateId,
        job_id: body.jobId, customer_id: body.customerId,
        filled_blocks: template.blocks || [],
        template_snapshot: template,
        signing_token: signingToken,
        created_by: userId,
      })
      .select("id, signing_token, status, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to create contract" }, { status: 500 });
    }

    return NextResponse.json({
      data: {
        id: data.id, signingToken: data.signing_token,
        status: data.status, createdAt: data.created_at,
      },
    }, { status: 201 });
  });
}
