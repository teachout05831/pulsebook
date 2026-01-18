import { NextRequest, NextResponse } from "next/server";
import { mockEstimates } from "./data";
import type { Estimate } from "@/types";

// GET /api/estimates - List estimates with pagination, search, and filtering
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("_page") || "1", 10);
  const limit = parseInt(searchParams.get("_limit") || "10", 10);
  const search = searchParams.get("q") || "";
  const status = searchParams.get("status") || "";
  const customerId = searchParams.get("customerId") || "";

  // Filter estimates
  let filtered = [...mockEstimates];

  // Search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.customerName.toLowerCase().includes(searchLower) ||
        e.estimateNumber.toLowerCase().includes(searchLower)
    );
  }

  // Status filter
  if (status) {
    filtered = filtered.filter((e) => e.status === status);
  }

  // Customer filter
  if (customerId) {
    filtered = filtered.filter((e) => e.customerId === customerId);
  }

  // Sort by issue date descending (most recent first)
  filtered.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

  // Pagination
  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedEstimates = filtered.slice(start, end);

  return NextResponse.json({
    data: paginatedEstimates,
    total,
  });
}

// POST /api/estimates - Create a new estimate
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Generate new estimate number
  const maxNum = mockEstimates.reduce((max, e) => {
    const num = parseInt(e.estimateNumber.replace("EST-", ""), 10);
    return num > max ? num : max;
  }, 0);
  const newEstimateNumber = `EST-${String(maxNum + 1).padStart(3, "0")}`;

  // Calculate totals from line items
  const lineItems = body.lineItems || [];
  const subtotal = lineItems.reduce((sum: number, item: { total: number }) => sum + item.total, 0);
  const taxRate = body.taxRate || 8;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const newEstimate: Estimate = {
    id: String(mockEstimates.length + 1),
    companyId: "demo-tenant",
    customerId: body.customerId,
    customerName: body.customerName,
    estimateNumber: newEstimateNumber,
    status: body.status || "draft",
    issueDate: body.issueDate || new Date().toISOString().split("T")[0],
    expiryDate: body.expiryDate || null,
    lineItems: lineItems.map((item: { description: string; quantity: number; unitPrice: number; total: number }, index: number) => ({
      id: String(index + 1),
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.total,
    })),
    subtotal,
    taxRate,
    taxAmount,
    total,
    notes: body.notes || null,
    terms: body.terms || null,
    address: body.address || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockEstimates.push(newEstimate);

  return NextResponse.json({ data: newEstimate }, { status: 201 });
}
