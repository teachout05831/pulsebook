import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/estimate-pages/[id]/request-changes - Request changes (public, no auth)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const body = await request.json().catch(() => ({}));
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  // Verify the page exists and is in a valid status
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
    return NextResponse.json({ error: "Estimate is not available for changes" }, { status: 400 });
  }

  // Record analytics event (does NOT change page status)
  const { error } = await supabase.from("estimate_page_analytics").insert({
    page_id: id,
    event_type: "cta_click",
    event_data: { action: "request_changes", message },
    device_type: null,
    referrer: null,
    user_agent: request.headers.get("user-agent") ?? null,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to record request" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
