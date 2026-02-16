import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

const SERVICE_TYPE_FIELDS = "id, company_id, name, description, default_price, is_active, created_at, updated_at";

// GET /api/service-types - List all service types
export async function GET(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    let query = supabase
      .from("service_types")
      .select(SERVICE_TYPE_FIELDS, { count: "exact" })
      .eq("company_id", companyId);

    if (activeOnly) {
      query = query.eq("is_active", true);
    }

    query = query.order("name", { ascending: true });

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: "Failed to fetch service types" }, { status: 500 });
    }

    // Transform to camelCase
    const serviceTypes = (data || []).map((st) => ({
      id: st.id,
      companyId: st.company_id,
      name: st.name,
      description: st.description,
      defaultPrice: st.default_price,
      isActive: st.is_active,
      createdAt: st.created_at,
      updatedAt: st.updated_at,
    }));

    return NextResponse.json(
      { data: serviceTypes, total: count || 0 },
      { headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" } }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST /api/service-types - Create a new service type
export async function POST(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const body = await request.json();

    if (!body.name || body.defaultPrice === undefined) {
      return NextResponse.json({ error: "Name and default price are required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("service_types")
      .insert({
        company_id: companyId,
        name: body.name,
        description: body.description || "",
        default_price: parseFloat(body.defaultPrice) || 0,
        is_active: true,
      })
      .select(SERVICE_TYPE_FIELDS)
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to create service type" }, { status: 500 });
    }

    const serviceType = {
      id: data.id,
      companyId: data.company_id,
      name: data.name,
      description: data.description,
      defaultPrice: data.default_price,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return NextResponse.json({ data: serviceType }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
