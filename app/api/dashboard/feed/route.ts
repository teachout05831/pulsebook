import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

const FEED_FIELDS = "id, entity_type, entity_id, action, description, metadata, performed_by_name, customer_id, customer_name, category, amount, created_at";

function convertEntry(d: Record<string, unknown>) {
  return {
    id: d.id as string,
    entityType: d.entity_type as string,
    entityId: d.entity_id as string,
    action: d.action as string,
    description: d.description as string,
    metadata: (d.metadata as Record<string, unknown>) || null,
    performedByName: (d.performed_by_name as string) || null,
    customerId: (d.customer_id as string) || null,
    customerName: (d.customer_name as string) || null,
    category: (d.category as string) || "system",
    amount: (d.amount as number) || null,
    createdAt: d.created_at as string,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 50);

    let query = supabase
      .from("activity_log")
      .select(FEED_FIELDS)
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .limit(limit + 1);

    if (cursor) {
      query = query.lt("created_at", cursor);
    }

    const { data, error } = await query;
    if (error) throw error;

    const rows = (data || []) as Record<string, unknown>[];
    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore ? page[page.length - 1].created_at as string : null;

    return NextResponse.json(
      { data: page.map(convertEntry), nextCursor },
      { headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" } }
    );
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.statusCode });
    return NextResponse.json({ error: "Failed to load feed" }, { status: 500 });
  }
}
