import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { logActivity } from "@/features/activity/utils/logActivity";

const INTERACTION_FIELDS = "id, company_id, customer_id, type, direction, subject, details, outcome, duration_seconds, performed_by, performed_by_name, created_at";

const VALID_TYPES = ["call", "text", "email", "meeting", "note"];
const CONTACT_TYPES = ["call", "text", "email", "meeting"];

function convertInteraction(item: Record<string, unknown>) {
  return {
    id: item.id,
    companyId: item.company_id,
    customerId: item.customer_id,
    type: item.type,
    direction: item.direction,
    subject: item.subject,
    details: item.details,
    outcome: item.outcome,
    durationSeconds: item.duration_seconds,
    performedBy: item.performed_by,
    performedByName: item.performed_by_name,
    createdAt: item.created_at,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { supabase, companyId } = await getAuthCompany();
    const customerId = request.nextUrl.searchParams.get("customerId");

    if (!customerId) {
      return NextResponse.json({ error: "customerId is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("interactions")
      .select(INTERACTION_FIELDS)
      .eq("company_id", companyId)
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Interactions list error:", error.message);
      return NextResponse.json({ error: "Failed to fetch interactions" }, { status: 500 });
    }

    const interactions = (data || []).map((item) => convertInteraction(item as Record<string, unknown>));

    return NextResponse.json(
      { data: interactions },
      { headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" } }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { supabase, user, companyId } = await getAuthCompany();
    const body = await request.json();

    if (!body.customerId) {
      return NextResponse.json({ error: "customerId is required" }, { status: 400 });
    }
    if (!body.type || !VALID_TYPES.includes(body.type)) {
      return NextResponse.json({ error: "Valid type is required" }, { status: 400 });
    }

    // Get user's name for snapshot
    const { data: userData } = await supabase
      .from("users")
      .select("full_name")
      .eq("id", user.id)
      .single();

    const { data, error } = await supabase
      .from("interactions")
      .insert({
        company_id: companyId,
        customer_id: body.customerId,
        type: body.type,
        direction: body.direction || null,
        subject: body.subject || null,
        details: body.details || null,
        outcome: body.outcome || null,
        duration_seconds: body.durationSeconds || null,
        performed_by: user.id,
        performed_by_name: userData?.full_name || user.email || "Unknown",
      })
      .select(INTERACTION_FIELDS)
      .single();

    if (error) {
      console.error("Create interaction error:", error.message);
      return NextResponse.json({ error: "Failed to create interaction" }, { status: 500 });
    }

    // Log to activity feed (fire-and-forget)
    const { data: custData } = await supabase.from("customers").select("name").eq("id", body.customerId).limit(1).single();
    const TYPE_LABELS: Record<string, string> = { call: "Phone call", text: "Text message", email: "Email", meeting: "Meeting", note: "Note" };
    const typeLabel = TYPE_LABELS[body.type] || body.type;
    const dirLabel = body.direction === "inbound" ? "from" : "to";
    logActivity(supabase, {
      companyId, entityType: "customer", entityId: body.customerId,
      action: body.type,
      description: `${typeLabel} ${dirLabel} <strong>${(custData as Record<string, unknown>)?.name || "customer"}</strong>${body.subject ? `: ${body.subject}` : ""}`,
      customerId: body.customerId,
      customerName: (custData as Record<string, unknown>)?.name as string || null,
      category: "manual",
      performedBy: user.id,
      performedByName: userData?.full_name || user.email || "Unknown",
      metadata: { type: body.type, direction: body.direction, outcome: body.outcome },
    });

    // Update last_contact_date for communication types
    if (CONTACT_TYPES.includes(body.type)) {
      await supabase
        .from("customers")
        .update({ last_contact_date: new Date().toISOString() })
        .eq("id", body.customerId)
        .eq("company_id", companyId);
    }

    return NextResponse.json({ data: convertInteraction(data as Record<string, unknown>) }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
