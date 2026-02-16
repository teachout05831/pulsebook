import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { supabase, companyId } = await getAuthCompany();
    const body = await request.json();

    if (!body.dueDate) {
      return NextResponse.json({ error: "Due date is required" }, { status: 400 });
    }

    // Ownership check
    const { data: existing } = await supabase
      .from("follow_ups")
      .select("company_id")
      .eq("id", id)
      .single();

    if (!existing || existing.company_id !== companyId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { error } = await supabase
      .from("follow_ups")
      .update({ due_date: body.dueDate })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to reschedule" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
