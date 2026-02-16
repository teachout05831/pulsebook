import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

const CONSULTATION_FIELDS = "id, company_id, customer_id, estimate_id, title, purpose, public_token, daily_room_name, daily_room_url, status, pipeline_status, pipeline_error, scheduled_at, started_at, ended_at, duration_seconds, expires_at, host_user_id, host_name, customer_name, customer_email, customer_phone, created_at";

// GET /api/consultations/[id] - Get consultation details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { companyId, supabase } = await getAuthCompany();

    const { data, error } = await supabase
      .from("consultations")
      .select(CONSULTATION_FIELDS)
      .eq("id", id)
      .eq("company_id", companyId)
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Consultation not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        id: data.id,
        companyId: data.company_id,
        customerId: data.customer_id,
        estimateId: data.estimate_id,
        title: data.title,
        purpose: data.purpose,
        publicToken: data.public_token,
        dailyRoomName: data.daily_room_name,
        dailyRoomUrl: data.daily_room_url,
        status: data.status,
        pipelineStatus: data.pipeline_status,
        pipelineError: data.pipeline_error,
        scheduledAt: data.scheduled_at,
        startedAt: data.started_at,
        endedAt: data.ended_at,
        durationSeconds: data.duration_seconds,
        expiresAt: data.expires_at,
        hostUserId: data.host_user_id,
        hostName: data.host_name,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        customerPhone: data.customer_phone,
        createdAt: data.created_at,
      },
    }, {
      headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PATCH /api/consultations/[id] - Update consultation status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { companyId, supabase } = await getAuthCompany();

    // Ownership check
    const { data: existing } = await supabase
      .from("consultations")
      .select("company_id, status")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Consultation not found" }, { status: 404 });
    }
    if (existing.company_id !== companyId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (body.status) updates.status = body.status;
    if (body.status === "active") updates.started_at = new Date().toISOString();
    if (body.status === "completed") {
      updates.ended_at = new Date().toISOString();
      if (body.durationSeconds) updates.duration_seconds = body.durationSeconds;
    }

    const { data, error } = await supabase
      .from("consultations")
      .update(updates)
      .eq("id", id)
      .select("id, status, started_at, ended_at, duration_seconds")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update consultation" }, { status: 500 });
    }

    return NextResponse.json({
      data: {
        id: data.id,
        status: data.status,
        startedAt: data.started_at,
        endedAt: data.ended_at,
        durationSeconds: data.duration_seconds,
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
