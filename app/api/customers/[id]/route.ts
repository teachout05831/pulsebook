import { NextRequest, NextResponse } from "next/server";
import { mockCustomers } from "../data";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const customer = mockCustomers.find(c => c.id === id);

  if (!customer) {
    return NextResponse.json(
      { message: "Customer not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    data: customer,
  });
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();

  const customerIndex = mockCustomers.findIndex(c => c.id === id);

  if (customerIndex === -1) {
    return NextResponse.json(
      { message: "Customer not found" },
      { status: 404 }
    );
  }

  // Update the customer (in-memory for mock)
  const updatedCustomer = {
    ...mockCustomers[customerIndex],
    ...body,
    updatedAt: new Date().toISOString(),
  };

  // Note: This won't persist since mockCustomers is reimported each request
  // In a real app, this would update the database
  mockCustomers[customerIndex] = updatedCustomer;

  return NextResponse.json({
    data: updatedCustomer,
  });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const customerIndex = mockCustomers.findIndex(c => c.id === id);

  if (customerIndex === -1) {
    return NextResponse.json(
      { message: "Customer not found" },
      { status: 404 }
    );
  }

  const deletedCustomer = mockCustomers[customerIndex];

  // Note: This won't persist since mockCustomers is reimported each request
  mockCustomers.splice(customerIndex, 1);

  return NextResponse.json({
    data: deletedCustomer,
  });
}
