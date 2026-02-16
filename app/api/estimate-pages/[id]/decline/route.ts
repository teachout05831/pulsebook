import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/estimate-pages/[id]/decline - Decline estimate (public, no auth)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const body = await request.json().catch(() => ({}));
  const reason = typeof body.reason === "string" ? body.reason : undefined;

  // Verify the page exists and check current status
  const { data: page } = await supabase
    .from("estimate_pages")
    .select("id, status, is_active")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (!page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  const allowedStatuses = ["published", "viewed"];
  if (!allowedStatuses.includes(page.status)) {
    return NextResponse.json(
      { error: page.status === "approved" || page.status === "declined" ? `Estimate has already been ${page.status}` : "Estimate is not available" },
      { status: 400 }
    );
  }

  // Update status to declined
  const { error: updateError } = await supabase
    .from("estimate_pages")
    .update({
      status: "declined",
      declined_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: "Failed to decline estimate" }, { status: 500 });
  }

  // Record analytics event
  await supabase.from("estimate_page_analytics").insert({
    page_id: id,
    event_type: "declined",
    event_data: reason ? { reason } : null,
    device_type: null,
    referrer: null,
    user_agent: request.headers.get("user-agent") ?? null,
  });

  return NextResponse.json({ success: true });
}
