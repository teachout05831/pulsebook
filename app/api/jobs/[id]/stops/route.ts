import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { getJobStops } from "@/features/job-stops/queries";
import { saveJobStops } from "@/features/job-stops/actions";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    const data = await getJobStops(supabase, companyId, id);
    const stops = (data || []).map((s) => ({
      id: s.id,
      jobId: s.job_id,
      stopOrder: s.stop_order,
      address: s.address,
      notes: s.notes,
      stopType: s.stop_type,
    }));
    return NextResponse.json({ data: stops }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Failed to fetch stops" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    const body = await request.json();
    const stops = (body.stops || []).map((s: Record<string, unknown>) => ({
      address: s.address,
      notes: s.notes || null,
      stopType: s.stopType || "stop",
      stopOrder: s.stopOrder ?? 0,
    }));

    const result = await saveJobStops(supabase, companyId, id, stops);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const saved = (result.data || []).map((s: Record<string, unknown>) => ({
      id: s.id,
      jobId: s.job_id,
      stopOrder: s.stop_order,
      address: s.address,
      notes: s.notes,
      stopType: s.stop_type,
    }));

    return NextResponse.json({ data: saved });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
