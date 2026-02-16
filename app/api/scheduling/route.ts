import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

export async function GET() {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const { data, error } = await supabase
      .from("scheduling_pages")
      .select("id, company_id, name, slug, public_token, status, is_active, published_at, total_views, total_bookings, created_at, updated_at")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });

    const pages = (data || []).map((p) => ({
      id: p.id,
      companyId: p.company_id,
      name: p.name,
      slug: p.slug,
      publicToken: p.public_token,
      status: p.status,
      isActive: p.is_active,
      publishedAt: p.published_at,
      totalViews: p.total_views,
      totalBookings: p.total_bookings,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    }));

    return NextResponse.json({ data: pages }, {
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
    await getAuthCompany();

    const body = await request.json();

    const { createSchedulingPage } = await import("@/features/scheduling/actions/createSchedulingPage");
    const result = await createSchedulingPage({ name: body.name, slug: body.slug });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ data: result.data }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
