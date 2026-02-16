import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

const ZONE_FIELDS = "id, company_id, name, color, zip_codes, is_active, created_at";

function toClient(r: Record<string, unknown>) {
  return { id: r.id, companyId: r.company_id, name: r.name, color: r.color, zipCodes: r.zip_codes, isActive: r.is_active, createdAt: r.created_at };
}

export async function GET() {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const { data, error } = await supabase.from("service_zones").select(ZONE_FIELDS).eq("company_id", companyId).order("created_at").limit(50);
    if (error) return NextResponse.json({ error: "Failed to fetch zones" }, { status: 500 });

    return NextResponse.json({ data: (data || []).map(z => toClient(z as Record<string, unknown>)) }, {
      headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" }
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
    const { companyId, supabase } = await getAuthCompany();

    const body = await request.json();
    if (!body.name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const { data, error } = await supabase.from("service_zones").insert({
      company_id: companyId, name: body.name, color: body.color || "#3b82f6", zip_codes: body.zipCodes || [],
    }).select(ZONE_FIELDS).single();

    if (error) return NextResponse.json({ error: "Failed to create zone" }, { status: 500 });
    return NextResponse.json({ data: toClient(data as Record<string, unknown>) }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
