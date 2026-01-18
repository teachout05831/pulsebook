import { NextRequest, NextResponse } from "next/server";
import { mockInvoices } from "../data";
import type { Invoice, InvoiceStatus, Payment } from "@/types";

// GET /api/invoices/[id] - Get a single invoice
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const invoice = mockInvoices.find((inv) => inv.id === id);

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  return NextResponse.json({ data: invoice });
}

// PATCH /api/invoices/[id] - Update an invoice
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = mockInvoices.findIndex((inv) => inv.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const body = await request.json();
  const existing = mockInvoices[index];

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

  // Handle payment addition
  let payments = existing.payments;
  let amountPaid = existing.amountPaid;

  if (body.newPayment) {
    const payment: Payment = {
      id: String(payments.length + 1),
      amount: body.newPayment.amount,
      method: body.newPayment.method,
      date: body.newPayment.date || new Date().toISOString().split("T")[0],
      notes: body.newPayment.notes || null,
    };
    payments = [...payments, payment];
    amountPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  }

  const amountDue = total - amountPaid;

  // Determine status based on payment
  let status = (body.status as InvoiceStatus) ?? existing.status;
  if (body.newPayment || body.status === undefined) {
    if (amountDue <= 0) {
      status = "paid";
    } else if (amountPaid > 0) {
      status = "partial";
    }
  }

  const updatedInvoice: Invoice = {
    ...existing,
    customerId: body.customerId ?? existing.customerId,
    customerName: body.customerName ?? existing.customerName,
    jobId: body.jobId !== undefined ? body.jobId : existing.jobId,
    estimateId: body.estimateId !== undefined ? body.estimateId : existing.estimateId,
    status,
    issueDate: body.issueDate ?? existing.issueDate,
    dueDate: body.dueDate ?? existing.dueDate,
    lineItems: body.lineItems ?? existing.lineItems,
    subtotal,
    taxRate,
    taxAmount,
    total,
    amountPaid,
    amountDue,
    payments,
    notes: body.notes !== undefined ? body.notes : existing.notes,
    terms: body.terms !== undefined ? body.terms : existing.terms,
    address: body.address !== undefined ? body.address : existing.address,
    updatedAt: new Date().toISOString(),
  };

  mockInvoices[index] = updatedInvoice;

  return NextResponse.json({ data: updatedInvoice });
}

// DELETE /api/invoices/[id] - Delete an invoice
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = mockInvoices.findIndex((inv) => inv.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  mockInvoices.splice(index, 1);

  return NextResponse.json({ data: { id } });
}
