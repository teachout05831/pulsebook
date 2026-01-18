import { NextRequest, NextResponse } from "next/server";
import { mockEstimates } from "../data";
import type { Estimate, EstimateStatus } from "@/types";

// GET /api/estimates/[id] - Get a single estimate
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const estimate = mockEstimates.find((e) => e.id === id);

  if (!estimate) {
    return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
  }

  return NextResponse.json({ data: estimate });
}

// PATCH /api/estimates/[id] - Update an estimate
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = mockEstimates.findIndex((e) => e.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
  }

  const body = await request.json();
  const existing = mockEstimates[index];

  // Recalculate totals if line items changed
  let subtotal = existing.subtotal;
  let taxAmount = existing.taxAmount;
  let total = existing.total;
  const taxRate = body.taxRate ?? existing.taxRate;

  if (body.lineItems) {
    subtotal = body.lineItems.reduce((sum: number, item: { total: number }) => sum + item.total, 0);
    taxAmount = subtotal * (taxRate / 100);
    total = subtotal + taxAmount;
  }

  const updatedEstimate: Estimate = {
    ...existing,
    customerId: body.customerId ?? existing.customerId,
    customerName: body.customerName ?? existing.customerName,
    status: (body.status as EstimateStatus) ?? existing.status,
    issueDate: body.issueDate ?? existing.issueDate,
    expiryDate: body.expiryDate !== undefined ? body.expiryDate : existing.expiryDate,
    lineItems: body.lineItems ?? existing.lineItems,
    subtotal,
    taxRate,
    taxAmount,
    total,
    notes: body.notes !== undefined ? body.notes : existing.notes,
    terms: body.terms !== undefined ? body.terms : existing.terms,
    address: body.address !== undefined ? body.address : existing.address,
    updatedAt: new Date().toISOString(),
  };

  mockEstimates[index] = updatedEstimate;

  return NextResponse.json({ data: updatedEstimate });
}

// DELETE /api/estimates/[id] - Delete an estimate
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = mockEstimates.findIndex((e) => e.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
  }

  mockEstimates.splice(index, 1);

  return NextResponse.json({ data: { id } });
}
