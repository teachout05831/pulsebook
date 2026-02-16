import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

// POST /api/estimate-pages/[id]/analytics - Record analytics event (public, no auth)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const body = await request.json();
  const userAgent = request.headers.get("user-agent") ?? null;

  // Support both single event and batched events
  const events: { eventType: string; eventData?: any; deviceType?: string; referrer?: string }[] = [];
  if (Array.isArray(body.events)) {
    events.push(...body.events);
  } else if (body.eventType) {
    events.push(body);
  }

  if (events.length === 0) {
    return NextResponse.json({ error: "Event type is required" }, { status: 400 });
  }

  // Cap batch size to prevent abuse
  if (events.length > 50) {
    return NextResponse.json({ error: "Too many events (max 50)" }, { status: 400 });
  }

  // Verify the page exists
  const { data: page } = await supabase
    .from("estimate_pages")
    .select("id")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (!page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  // Record all events
  const rows = events.map((e) => ({
    page_id: id,
    event_type: e.eventType,
    event_data: e.eventData ?? null,
    device_type: e.deviceType ?? null,
    referrer: e.referrer ?? null,
    user_agent: userAgent,
  }));

  const { error } = await supabase
    .from("estimate_page_analytics")
    .insert(rows);

  if (error) {
    return NextResponse.json({ error: "Failed to record event" }, { status: 500 });
  }

  // Update view tracking if any event is a page_view
  const hasPageView = events.some((e) => e.eventType === "page_view");
  if (hasPageView) {
    const now = new Date().toISOString();
    await supabase.rpc("update_page_view_tracking", {
      page_id: id,
      viewed_at: now,
    });
  }

  return NextResponse.json({ success: true });
}

// GET /api/estimate-pages/[id]/analytics - Get analytics (auth required)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    // Verify page ownership
    const { data: page } = await supabase
      .from("estimate_pages")
      .select("id")
      .eq("id", id)
      .eq("company_id", companyId)
      .single();

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("_limit") || "100", 10);

    const { data, error } = await supabase
      .from("estimate_page_analytics")
      .select("id, page_id, event_type, event_data, device_type, referrer, user_agent, created_at")
      .eq("page_id", id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
    }

    const events = (data || []).map((e) => ({
      id: e.id,
      pageId: e.page_id,
      eventType: e.event_type,
      eventData: e.event_data,
      deviceType: e.device_type,
      referrer: e.referrer,
      userAgent: e.user_agent,
      createdAt: e.created_at,
    }));

    return NextResponse.json({ data: events, total: events.length }, {
      headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
