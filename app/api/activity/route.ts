import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import type { ActivityEntry } from "@/features/activity/types";

const FIELDS = "id, company_id, entity_type, entity_id, action, description, metadata, performed_by, performed_by_name, customer_id, customer_name, category, amount, created_at";

function convertEntry(d: Record<string, unknown>): ActivityEntry {
  return {
    id: d.id as string,
    entityType: d.entity_type as ActivityEntry["entityType"],
    entityId: d.entity_id as string,
    action: d.action as ActivityEntry["action"],
    description: d.description as string,
    metadata: (d.metadata as Record<string, unknown>) || null,
    performedBy: (d.performed_by as string) || null,
    performedByName: (d.performed_by_name as string) || null,
    customerId: (d.customer_id as string) || null,
    customerName: (d.customer_name as string) || null,
    category: (d.category as ActivityEntry["category"]) || "system",
    amount: (d.amount as number) || null,
    createdAt: d.created_at as string,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const url = new URL(request.url);
    const entityType = url.searchParams.get("entityType");
    const entityId = url.searchParams.get("entityId");
    if (!entityType || !entityId) return NextResponse.json({ error: "entityType and entityId required" }, { status: 400 });

    const { data, error } = await supabase
      .from("activity_log")
      .select(FIELDS)
      .eq("company_id", companyId)
      .eq("entity_type", entityType)
      .eq("entity_id", entityId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({
      data: (data || []).map((d) => convertEntry(d as Record<string, unknown>)),
    }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.statusCode });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
