import { NextRequest, NextResponse } from "next/server";
import { mockServiceTypes } from "../data";

// GET /api/service-types/[id] - Get a single service type
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const serviceType = mockServiceTypes.find((st) => st.id === id);

  if (!serviceType) {
    return NextResponse.json(
      { error: "Service type not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: serviceType });
}

// PATCH /api/service-types/[id] - Update a service type
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const index = mockServiceTypes.findIndex((st) => st.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Service type not found" },
      { status: 404 }
    );
  }

  const updated = {
    ...mockServiceTypes[index],
    name: body.name ?? mockServiceTypes[index].name,
    description: body.description ?? mockServiceTypes[index].description,
    defaultPrice: body.defaultPrice !== undefined
      ? parseFloat(body.defaultPrice)
      : mockServiceTypes[index].defaultPrice,
    isActive: body.isActive !== undefined
      ? body.isActive
      : mockServiceTypes[index].isActive,
    updatedAt: new Date().toISOString(),
  };

  mockServiceTypes[index] = updated;

  return NextResponse.json({ data: updated });
}

// DELETE /api/service-types/[id] - Delete a service type
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = mockServiceTypes.findIndex((st) => st.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Service type not found" },
      { status: 404 }
    );
  }

  mockServiceTypes.splice(index, 1);

  return NextResponse.json({ success: true });
}
