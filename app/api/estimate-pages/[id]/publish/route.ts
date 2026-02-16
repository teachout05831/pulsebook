import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

// POST /api/estimate-pages/[id]/publish - Publish an estimate page
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    // Get current page
    const { data: page } = await supabase
      .from("estimate_pages")
      .select("id, status, public_token, incentive_config")
      .eq("id", id)
      .eq("company_id", companyId)
      .single();

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    if (page.status !== "draft") {
      return NextResponse.json({ error: "Only draft pages can be published" }, { status: 400 });
    }

    const publishedAt = new Date().toISOString();
    const updatePayload: Record<string, unknown> = {
      status: "published",
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    };

    // Resolve incentive deadlines
    if (page.incentive_config?.enabled && page.incentive_config?.tiers?.length > 0) {
      const publishMs = new Date(publishedAt).getTime();
      const resolvedConfig = {
        ...page.incentive_config,
        tiers: page.incentive_config.tiers.map((tier: any) => ({
          ...tier,
          deadline: tier.deadlineMode === "relative" && tier.relativeHours != null
            ? new Date(publishMs + tier.relativeHours * 60 * 60 * 1000).toISOString()
            : tier.absoluteDeadline || tier.deadline,
        })),
      };
      updatePayload.incentive_config = resolvedConfig;
    }

    const { error } = await supabase
      .from("estimate_pages")
      .update(updatePayload)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to publish page" }, { status: 500 });
    }

    return NextResponse.json({
      data: {
        publicToken: page.public_token,
        status: "published",
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
