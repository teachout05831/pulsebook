import { NextRequest, NextResponse } from "next/server";
import { mockCompany } from "./data";
import type { Company } from "@/types";

// GET /api/company - Get company profile
export async function GET() {
  return NextResponse.json({ data: mockCompany });
}

// PATCH /api/company - Update company profile
export async function PATCH(request: NextRequest) {
  const body = await request.json();

  // Update the company (in-memory for mock)
  const updatedCompany: Company = {
    ...mockCompany,
    name: body.name ?? mockCompany.name,
    email: body.email ?? mockCompany.email,
    phone: body.phone ?? mockCompany.phone,
    address: body.address ?? mockCompany.address,
    city: body.city ?? mockCompany.city,
    state: body.state ?? mockCompany.state,
    zipCode: body.zipCode ?? mockCompany.zipCode,
    website: body.website ?? mockCompany.website,
    industry: body.industry ?? mockCompany.industry,
    logoUrl: body.logoUrl !== undefined ? body.logoUrl : mockCompany.logoUrl,
    settings: body.settings ? { ...mockCompany.settings, ...body.settings } : mockCompany.settings,
    updatedAt: new Date().toISOString(),
  };

  // Update the mock data reference
  Object.assign(mockCompany, updatedCompany);

  return NextResponse.json({ data: updatedCompany });
}
