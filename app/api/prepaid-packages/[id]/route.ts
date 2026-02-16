import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

interface RouteParams { params: Promise<{ id: string }> }

const PKG_FIELDS = "id, company_id, name, visit_count, total_price, per_visit_price, discount_percent, is_active, created_at";

function convertPackage(d: Record<string, unknown>) {
  return {
    id: d.id, companyId: d.company_id, name: d.name,
    visitCount: d.visit_count, totalPrice: d.total_price,
    perVisitPrice: d.per_visit_price, discountPercent: d.discount_percent || 0,
    isActive: d.is_active, createdAt: d.created_at,
  };
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { companyId, supabase } = await getAuthCompany();

    const { data: existing } = await supabase.from("service_packages").select("company_id").eq("id", id).single();
    if (!existing) return NextResponse.json({ error: "Package not found" }, { status: 404 });
    if (existing.company_id !== companyId) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    const u: Record<string, unknown> = {};
    if (body.name !== undefined) u.name = body.name;
    if (body.visitCount !== undefined) u.visit_count = body.visitCount;
    if (body.totalPrice !== undefined) u.total_price = body.totalPrice;
    if (body.perVisitPrice !== undefined) u.per_visit_price = body.perVisitPrice;
    if (body.discountPercent !== undefined) u.discount_percent = body.discountPercent;
    if (body.isActive !== undefined) u.is_active = body.isActive;

    const { data, error } = await supabase.from("service_packages").update(u).eq("id", id).select(PKG_FIELDS).single();
    if (error) throw error;

    return NextResponse.json({ data: convertPackage(data as Record<string, unknown>) });
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.statusCode });
    return NextResponse.json({ error: "Failed to update package" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    const { data: existing } = await supabase.from("service_packages").select("company_id").eq("id", id).single();
    if (!existing) return NextResponse.json({ error: "Package not found" }, { status: 404 });
    if (existing.company_id !== companyId) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    const { error } = await supabase.from("service_packages").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ data: { id } });
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.statusCode });
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 });
  }
}
