import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/estimate-pages/[id]/approve - Approve estimate (public, no auth)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Verify the page exists and check current status
  const { data: page } = await supabase
    .from("estimate_pages")
    .select("id, status, is_active, incentive_config")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (!page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  const allowedStatuses = ["published", "viewed"];
  if (!allowedStatuses.includes(page.status)) {
    return NextResponse.json(
      { error: page.status === "approved" || page.status === "declined" ? `Estimate has already been ${page.status}` : "Estimate is not available for approval" },
      { status: 400 }
    );
  }

  // Snapshot active incentive tier
  let approvedIncentiveTier = null;
  if (page.incentive_config?.enabled && page.incentive_config?.tiers?.length > 0) {
    const now = Date.now();
    const activeTier = page.incentive_config.tiers
      .filter((t: any) => t.deadline && new Date(t.deadline).getTime() > now)
      .sort((a: any, b: any) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0];
    approvedIncentiveTier = activeTier || null;
  }

  // Update status to approved
  const { error: updateError } = await supabase
    .from("estimate_pages")
    .update({
      status: "approved",
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      approved_incentive_tier: approvedIncentiveTier,
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: "Failed to approve estimate" }, { status: 500 });
  }

  // Parse optional selected package from request body
  let selectedPackage = null;
  try {
    const body = await request.json();
    if (body?.selectedPackage) selectedPackage = body.selectedPackage;
  } catch { /* no body or invalid JSON */ }

  // Record analytics event
  await supabase.from("estimate_page_analytics").insert({
    page_id: id,
    event_type: "approved",
    event_data: selectedPackage ? { selectedPackage } : null,
    device_type: null,
    referrer: null,
    user_agent: request.headers.get("user-agent") ?? null,
  });

  return NextResponse.json({ success: true });
}
