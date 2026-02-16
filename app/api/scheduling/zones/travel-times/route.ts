import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

export async function GET() {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const { data, error } = await supabase.from("zone_travel_times").select("id, company_id, from_zone_id, to_zone_id, travel_minutes").eq("company_id", companyId).limit(500);
    if (error) return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });

    const items = (data || []).map(t => ({ id: t.id, companyId: t.company_id, fromZoneId: t.from_zone_id, toZoneId: t.to_zone_id, travelMinutes: t.travel_minutes }));
    return NextResponse.json({ data: items }, {
      headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const body = await request.json();
    if (!Array.isArray(body.travelTimes)) return NextResponse.json({ error: "travelTimes array required" }, { status: 400 });

    await supabase.from("zone_travel_times").delete().eq("company_id", companyId);

    const rows = body.travelTimes.map((t: { fromZoneId: string; toZoneId: string; travelMinutes: number }) => ({
      company_id: companyId, from_zone_id: t.fromZoneId, to_zone_id: t.toZoneId, travel_minutes: t.travelMinutes,
    }));

    if (rows.length > 0) {
      const { error } = await supabase.from("zone_travel_times").insert(rows);
      if (error) return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
