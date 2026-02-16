import { NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

const FOLLOW_UP_FIELDS = "id, company_id, customer_id, type, details, due_date, status, assigned_to, completed_at, created_by, created_at, updated_at";

export async function GET() {
  try {
    const { supabase, companyId } = await getAuthCompany();

    const { data, error } = await supabase
      .from("follow_ups")
      .select(`${FOLLOW_UP_FIELDS}, customers:customer_id(name)`)
      .eq("company_id", companyId)
      .eq("status", "pending")
      .order("due_date", { ascending: true })
      .limit(100);

    if (error) {
      console.error("Follow-ups list error:", error.message);
      return NextResponse.json({ error: "Failed to fetch follow-ups" }, { status: 500 });
    }

    const followUps = (data || []).map((item) => {
      const customer = Array.isArray(item.customers) ? item.customers[0] : item.customers;
      return {
        id: item.id,
        companyId: item.company_id,
        customerId: item.customer_id,
        customerName: (customer as Record<string, unknown>)?.name || "",
        type: item.type,
        details: item.details,
        dueDate: item.due_date,
        status: item.status,
        assignedTo: item.assigned_to,
        completedAt: item.completed_at,
        createdBy: item.created_by,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      };
    });

    return NextResponse.json(
      { data: followUps },
      { headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" } }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
