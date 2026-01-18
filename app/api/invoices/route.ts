import { NextRequest, NextResponse } from "next/server";
import { mockInvoices } from "./data";
import type { Invoice } from "@/types";

// GET /api/invoices - List invoices with pagination, search, and filtering
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("_page") || "1", 10);
  const limit = parseInt(searchParams.get("_limit") || "10", 10);
  const search = searchParams.get("q") || "";
  const status = searchParams.get("status") || "";
  const customerId = searchParams.get("customerId") || "";

  // Filter invoices
  let filtered = [...mockInvoices];

  // Search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (inv) =>
        inv.customerName.toLowerCase().includes(searchLower) ||
        inv.invoiceNumber.toLowerCase().includes(searchLower)
    );
  }

  // Status filter
  if (status) {
    filtered = filtered.filter((inv) => inv.status === status);
  }

  // Customer filter
  if (customerId) {
    filtered = filtered.filter((inv) => inv.customerId === customerId);
  }

  // Sort by issue date descending (most recent first)
  filtered.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

  // Pagination
  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedInvoices = filtered.slice(start, end);

  return NextResponse.json({
    data: paginatedInvoices,
    total,
  });
}

// POST /api/invoices - Create a new invoice
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Generate new invoice number
  const maxNum = mockInvoices.reduce((max, inv) => {
    const num = parseInt(inv.invoiceNumber.replace("INV-", ""), 10);
    return num > max ? num : max;
  }, 0);
  const newInvoiceNumber = `INV-${String(maxNum + 1).padStart(3, "0")}`;

  // Calculate totals from line items
  const lineItems = body.lineItems || [];
  const subtotal = lineItems.reduce((sum: number, item: { total: number }) => sum + item.total, 0);
  const taxRate = body.taxRate || 8;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const newInvoice: Invoice = {
    id: String(mockInvoices.length + 1),
    companyId: "demo-tenant",
    customerId: body.customerId,
    customerName: body.customerName,
    jobId: body.jobId || null,
    estimateId: body.estimateId || null,
    invoiceNumber: newInvoiceNumber,
    status: body.status || "draft",
    issueDate: body.issueDate || new Date().toISOString().split("T")[0],
    dueDate: body.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
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
    amountPaid: 0,
    amountDue: total,
    payments: [],
    notes: body.notes || null,
    terms: body.terms || null,
    address: body.address || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockInvoices.push(newInvoice);

  return NextResponse.json({ data: newInvoice }, { status: 201 });
}
