import { NextRequest, NextResponse } from "next/server";
import { mockServiceTypes, getNextId } from "./data";
import type { ServiceType } from "@/types";

// GET /api/service-types - List all service types
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const activeOnly = searchParams.get("active") === "true";

  let serviceTypes = [...mockServiceTypes];

  if (activeOnly) {
    serviceTypes = serviceTypes.filter((st) => st.isActive);
  }

  // Sort by name
  serviceTypes.sort((a, b) => a.name.localeCompare(b.name));

  return NextResponse.json({
    data: serviceTypes,
    total: serviceTypes.length,
  });
}

// POST /api/service-types - Create a new service type
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.name || body.defaultPrice === undefined) {
    return NextResponse.json(
      { error: "Name and default price are required" },
      { status: 400 }
    );
  }

  const newServiceType: ServiceType = {
    id: getNextId(),
    companyId: "company-001",
    name: body.name,
    description: body.description || "",
    defaultPrice: parseFloat(body.defaultPrice) || 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockServiceTypes.push(newServiceType);

  return NextResponse.json({ data: newServiceType }, { status: 201 });
}
