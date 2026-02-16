import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { supabase, companyId } = await getAuthCompany();

    const { data, error } = await supabase
      .from("follow_ups")
      .select("id, customer_id, type, details, due_date, status, assigned_to, completed_at, created_by, created_at, updated_at")
      .eq("company_id", companyId)
      .eq("customer_id", id)
      .order("due_date", { ascending: true })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch follow-ups" }, { status: 500 });
    }

    return NextResponse.json({
      data: (data || []).map((item) => ({
        id: item.id,
        customerId: item.customer_id,
        type: item.type,
        details: item.details,
        dueDate: item.due_date,
        status: item.status,
        assignedTo: item.assigned_to,
        completedAt: item.completed_at,
        createdBy: item.created_by,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      })),
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
