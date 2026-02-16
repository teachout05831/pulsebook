import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const LOCATION_FIELDS =
  "id, estimate_id, location_type, label, address, city, state, zip, property_type, access_notes, lat, lng, sort_order";

// GET /api/estimates/[id]/locations - List locations for an estimate
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    // Verify estimate ownership
    const { data: est } = await supabase
      .from("estimates")
      .select("company_id")
      .eq("id", id)
      .single();

    if (!est || est.company_id !== companyId) {
      return NextResponse.json({ error: "Estimate not found" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("estimate_locations")
      .select(LOCATION_FIELDS)
      .eq("estimate_id", id)
      .order("sort_order", { ascending: true })
      .limit(20);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
    }

    const locations = (data || []).map((l) => ({
      id: l.id,
      estimateId: l.estimate_id,
      locationType: l.location_type,
      label: l.label,
      address: l.address,
      city: l.city,
      state: l.state,
      zip: l.zip,
      propertyType: l.property_type,
      accessNotes: l.access_notes,
      lat: l.lat || null, lng: l.lng || null,
      sortOrder: l.sort_order,
    }));

    return NextResponse.json({ data: locations }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST /api/estimates/[id]/locations - Create a location
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    // Verify estimate ownership
    const { data: est } = await supabase
      .from("estimates")
      .select("company_id")
      .eq("id", id)
      .single();

    if (!est || est.company_id !== companyId) {
      return NextResponse.json({ error: "Estimate not found" }, { status: 403 });
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from("estimate_locations")
      .insert({
        estimate_id: id,
        company_id: companyId,
        location_type: body.locationType || null,
        label: body.label || null,
        address: body.address || null,
        city: body.city || null,
        state: body.state || null,
        zip: body.zip || null,
        property_type: body.propertyType || null,
        access_notes: body.accessNotes || null,
        lat: body.lat ?? null,
        lng: body.lng ?? null,
        sort_order: body.sortOrder ?? 0,
      })
      .select(LOCATION_FIELDS)
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to create location" }, { status: 500 });
    }

    const location = {
      id: data.id,
      estimateId: data.estimate_id,
      locationType: data.location_type,
      label: data.label,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zip,
      propertyType: data.property_type,
      accessNotes: data.access_notes,
      lat: data.lat || null, lng: data.lng || null,
      sortOrder: data.sort_order,
    };

    return NextResponse.json({ data: location }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
