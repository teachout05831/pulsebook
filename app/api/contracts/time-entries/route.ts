import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

export async function GET(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const contractId = request.nextUrl.searchParams.get("contractId");
    if (!contractId) {
      return NextResponse.json({ error: "contractId is required" }, { status: 400 });
    }

    const { data: contract } = await supabase
      .from("contract_instances")
      .select("company_id")
      .eq("id", contractId)
      .single();

    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }
    if (contract.company_id !== companyId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("contract_time_entries")
      .select("id, contract_id, event_type, recorded_at, recorded_by, reason, is_billable, gps_latitude, gps_longitude, notes, original_recorded_at, edited_at, edited_by, edit_reason")
      .eq("contract_id", contractId)
      .order("recorded_at", { ascending: true })
      .limit(200);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch time entries" }, { status: 500 });
    }

    const entries = (data || []).map((row) => ({
      id: row.id,
      contractId: row.contract_id,
      eventType: row.event_type,
      recordedAt: row.recorded_at,
      recordedBy: row.recorded_by,
      reason: row.reason,
      isBillable: row.is_billable,
      gpsLatitude: row.gps_latitude,
      gpsLongitude: row.gps_longitude,
      notes: row.notes,
      originalRecordedAt: row.original_recorded_at,
      editedAt: row.edited_at,
      editedBy: row.edited_by,
      editReason: row.edit_reason,
    }));

    return NextResponse.json({ data: entries }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, companyId, supabase } = await getAuthCompany();

    const body = await request.json();

    if (!body.contractId) {
      return NextResponse.json({ error: "contractId is required" }, { status: 400 });
    }
    if (!body.eventType) {
      return NextResponse.json({ error: "eventType is required" }, { status: 400 });
    }

    const { data: contract } = await supabase
      .from("contract_instances")
      .select("company_id")
      .eq("id", body.contractId)
      .single();

    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }
    if (contract.company_id !== companyId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("contract_time_entries")
      .insert({
        contract_id: body.contractId,
        event_type: body.eventType,
        reason: body.reason || null,
        is_billable: body.isBillable !== undefined ? body.isBillable : true,
        gps_latitude: body.gpsLatitude || null,
        gps_longitude: body.gpsLongitude || null,
        notes: body.notes || null,
        recorded_by: user.id,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to create time entry" }, { status: 500 });
    }

    return NextResponse.json({
      data: {
        id: data.id,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
