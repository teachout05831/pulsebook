import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { user, companyId, supabase } = await getAuthCompany();

    const body = await request.json();

    if (!body.editReason) {
      return NextResponse.json({ error: "editReason is required for edits" }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from("contract_time_entries")
      .select("id, contract_id, recorded_at, original_recorded_at")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Time entry not found" }, { status: 404 });
    }

    const { data: contract } = await supabase
      .from("contract_instances")
      .select("company_id")
      .eq("id", existing.contract_id)
      .single();

    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }
    if (contract.company_id !== companyId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const updates: Record<string, unknown> = {};

    if (existing.original_recorded_at === null) {
      updates.original_recorded_at = existing.recorded_at;
    }

    if (body.recordedAt !== undefined) updates.recorded_at = body.recordedAt;
    if (body.reason !== undefined) updates.reason = body.reason;
    if (body.isBillable !== undefined) updates.is_billable = body.isBillable;
    if (body.notes !== undefined) updates.notes = body.notes;

    updates.edited_at = new Date().toISOString();
    updates.edited_by = user.id;
    updates.edit_reason = body.editReason;

    const { error } = await supabase
      .from("contract_time_entries")
      .update(updates)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to update time entry" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
