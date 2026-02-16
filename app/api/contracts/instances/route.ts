import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

export async function GET(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const sp = request.nextUrl.searchParams;

    const jobId = sp.get("jobId");
    const allMode = sp.get("all") === "true";
    const statusFilter = sp.get("status");
    const dateFrom = sp.get("dateFrom");
    const dateTo = sp.get("dateTo");
    const page = parseInt(sp.get("_page") || "1", 10);
    const limit = Math.min(parseInt(sp.get("_limit") || "50", 10), 100);
    const offset = (page - 1) * limit;

    // Join to customers and jobs for list view
    let query = supabase
      .from("contract_instances")
      .select(
        "id, template_id, job_id, customer_id, status, template_snapshot, sent_at, signed_at, created_at, customers(name), jobs(title)",
        { count: "exact" }
      )
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });

    if (jobId) query = query.eq("job_id", jobId);
    if (statusFilter) query = query.eq("status", statusFilter);
    if (dateFrom) query = query.gte("created_at", dateFrom);
    if (dateTo) query = query.lte("created_at", `${dateTo}T23:59:59`);

    if (allMode) {
      query = query.range(offset, offset + limit - 1);
    } else {
      query = query.limit(limit);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: "Failed to fetch contract instances" }, { status: 500 });
    }

    const searchQuery = sp.get("q")?.toLowerCase();
    const templateNameFilter = sp.get("templateName")?.toLowerCase();

    let instances = (data || []).map((row: Record<string, unknown>) => {
      const snapshot = row.template_snapshot as Record<string, unknown> | null;
      const cust = row.customers as Record<string, unknown> | null;
      const job = row.jobs as Record<string, unknown> | null;
      return {
        id: row.id,
        templateName: (snapshot?.name as string) || "",
        templateCategory: (snapshot?.category as string) || null,
        customerName: (cust?.name as string) || "",
        customerId: row.customer_id as string,
        jobTitle: (job?.title as string) || null,
        jobId: row.job_id as string,
        status: row.status as string,
        signedAt: row.signed_at as string | null,
        createdAt: row.created_at as string,
      };
    });

    // Search across template name, customer, job
    if (searchQuery) {
      instances = instances.filter(
        (i) =>
          i.templateName.toLowerCase().includes(searchQuery) ||
          i.customerName.toLowerCase().includes(searchQuery) ||
          (i.jobTitle && i.jobTitle.toLowerCase().includes(searchQuery))
      );
    }

    if (templateNameFilter) {
      instances = instances.filter((i) =>
        i.templateName.toLowerCase().includes(templateNameFilter)
      );
    }

    // Stats from fetched page
    const statuses = (data || []).map((r) => r.status as string);
    const stats = {
      total: count ?? instances.length,
      signed: statuses.filter((s) => s === "signed").length,
      sentPending: statuses.filter((s) => s === "sent" || s === "viewed").length,
      completed: statuses.filter((s) => s === "completed").length,
    };

    return NextResponse.json({
      data: instances,
      total: count ?? instances.length,
      stats,
    }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, companyId, supabase } = await getAuthCompany();

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

    const { data: template, error: templateError } = await supabase
      .from("contract_templates")
      .select("id, company_id, name, description, category, design_theme, blocks, stage_colors, is_active, is_default, version, created_at, updated_at")
      .eq("id", body.templateId)
      .single();

    if (templateError || !template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }
    if (template.company_id !== companyId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
    if (!template.is_active) {
      return NextResponse.json({ error: "Template is not active" }, { status: 400 });
    }

    const signingToken = crypto.randomUUID();

    const { data, error } = await supabase
      .from("contract_instances")
      .insert({
        company_id: companyId,
        template_id: body.templateId,
        job_id: body.jobId,
        customer_id: body.customerId,
        filled_blocks: template.blocks || [],
        template_snapshot: template,
        signing_token: signingToken,
        created_by: user.id,
      })
      .select("id, signing_token")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to create contract instance" }, { status: 500 });
    }

    return NextResponse.json({
      data: {
        id: data.id,
        signingToken: data.signing_token,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
