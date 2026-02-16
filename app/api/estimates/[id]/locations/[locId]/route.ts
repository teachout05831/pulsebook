import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

interface RouteParams {
  params: Promise<{ id: string; locId: string }>;
}

const LOCATION_FIELDS =
  "id, estimate_id, location_type, label, address, city, state, zip, property_type, access_notes, lat, lng, sort_order";

// PATCH /api/estimates/[id]/locations/[locId] - Update a location
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, locId } = await params;
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

    // Verify location belongs to this estimate
    const { data: existing } = await supabase
      .from("estimate_locations")
      .select("id, estimate_id")
      .eq("id", locId)
      .eq("estimate_id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    if (body.locationType !== undefined) updateData.location_type = body.locationType;
    if (body.label !== undefined) updateData.label = body.label;
    if (body.address !== undefined) updateData.address = body.address;
    if (body.city !== undefined) updateData.city = body.city;
    if (body.state !== undefined) updateData.state = body.state;
    if (body.zip !== undefined) updateData.zip = body.zip;
    if (body.propertyType !== undefined) updateData.property_type = body.propertyType;
    if (body.accessNotes !== undefined) updateData.access_notes = body.accessNotes;
    if (body.lat !== undefined) updateData.lat = body.lat;
    if (body.lng !== undefined) updateData.lng = body.lng;
    if (body.sortOrder !== undefined) updateData.sort_order = body.sortOrder;

    const { data, error } = await supabase
      .from("estimate_locations")
      .update(updateData)
      .eq("id", locId)
      .select(LOCATION_FIELDS)
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update location" }, { status: 500 });
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

    return NextResponse.json({ data: location });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// DELETE /api/estimates/[id]/locations/[locId] - Delete a location
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, locId } = await params;
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

    // Verify location belongs to this estimate
    const { data: existing } = await supabase
      .from("estimate_locations")
      .select("id, estimate_id")
      .eq("id", locId)
      .eq("estimate_id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    const { error } = await supabase
      .from("estimate_locations")
      .delete()
      .eq("id", locId);

    if (error) {
      return NextResponse.json({ error: "Failed to delete location" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
