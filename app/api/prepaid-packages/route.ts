import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

const PKG_FIELDS = "id, company_id, name, visit_count, total_price, per_visit_price, discount_percent, is_active, created_at";

function convertPackage(d: Record<string, unknown>) {
  return {
    id: d.id, companyId: d.company_id, name: d.name,
    visitCount: d.visit_count, totalPrice: d.total_price,
    perVisitPrice: d.per_visit_price, discountPercent: d.discount_percent || 0,
    isActive: d.is_active, createdAt: d.created_at,
  };
}

export async function GET(req: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const activeOnly = new URL(req.url).searchParams.get("activeOnly") === "true";

    let query = supabase.from("service_packages").select(PKG_FIELDS).eq("company_id", companyId);
    if (activeOnly) query = query.eq("is_active", true);

    const { data, error } = await query.order("name").limit(100);
    if (error) throw error;

    return NextResponse.json({ data: (data || []).map((d) => convertPackage(d as Record<string, unknown>)) }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.statusCode });
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const body = await req.json();

    if (!body.name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    if (!body.visitCount || body.visitCount <= 0) return NextResponse.json({ error: "Visit count must be positive" }, { status: 400 });
    if (!body.totalPrice || body.totalPrice <= 0) return NextResponse.json({ error: "Total price must be positive" }, { status: 400 });

    const perVisitPrice = body.perVisitPrice || Math.round((body.totalPrice / body.visitCount) * 100) / 100;

    const { data, error } = await supabase.from("service_packages").insert({
      company_id: companyId,
      name: body.name.trim(),
      visit_count: body.visitCount,
      total_price: body.totalPrice,
      per_visit_price: perVisitPrice,
      discount_percent: body.discountPercent || 0,
      is_active: true,
    }).select(PKG_FIELDS).single();

    if (error) throw error;
    return NextResponse.json({ data: convertPackage(data as Record<string, unknown>) });
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.statusCode });
    return NextResponse.json({ error: "Failed to create package" }, { status: 500 });
  }
}
