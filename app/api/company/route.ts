import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

const COMPANY_FIELDS = "id, name, slug, email, phone, address, city, state, zip_code, website, industry, logo_url, settings, created_at, updated_at";

// GET /api/company - Get company profile
export async function GET() {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const { data, error } = await supabase
      .from("companies")
      .select(COMPANY_FIELDS)
      .eq("id", companyId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const company = {
      id: data.id,
      name: data.name,
      slug: data.slug,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zip_code,
      website: data.website,
      industry: data.industry,
      logoUrl: data.logo_url,
      settings: data.settings || {},
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return NextResponse.json(
      { data: company },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PATCH /api/company - Update company profile
export async function PATCH(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.address !== undefined) updateData.address = body.address;
    if (body.city !== undefined) updateData.city = body.city;
    if (body.state !== undefined) updateData.state = body.state;
    if (body.zipCode !== undefined) updateData.zip_code = body.zipCode;
    if (body.website !== undefined) updateData.website = body.website;
    if (body.industry !== undefined) updateData.industry = body.industry;
    if (body.logoUrl !== undefined) updateData.logo_url = body.logoUrl;
    if (body.settings !== undefined) updateData.settings = body.settings;

    const { data, error } = await supabase
      .from("companies")
      .update(updateData)
      .eq("id", companyId)
      .select(COMPANY_FIELDS)
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update company" }, { status: 500 });
    }

    const company = {
      id: data.id,
      name: data.name,
      slug: data.slug,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zip_code,
      website: data.website,
      industry: data.industry,
      logoUrl: data.logo_url,
      settings: data.settings || {},
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return NextResponse.json({ data: company });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
