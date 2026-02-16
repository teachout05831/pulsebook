import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/api-auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  return withApiAuth(request, async ({ companyId, supabase }) => {
    const { data, error } = await supabase
      .from("estimates")
      .select("id, customer_id, estimate_number, status, issue_date, expiry_date, line_items, subtotal, tax_rate, tax_amount, total, notes, terms, address, created_at, updated_at, customers(name)")
      .eq("id", id)
      .eq("company_id", companyId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
    }

    const customer = Array.isArray(data.customers) ? data.customers[0] : data.customers;
    return NextResponse.json({
      data: {
        id: data.id, customerId: data.customer_id,
        customerName: customer?.name || "",
        estimateNumber: data.estimate_number, status: data.status,
        issueDate: data.issue_date, expiryDate: data.expiry_date,
        lineItems: data.line_items || [], subtotal: data.subtotal,
        taxRate: data.tax_rate, taxAmount: data.tax_amount, total: data.total,
        notes: data.notes, terms: data.terms, address: data.address,
        createdAt: data.created_at, updatedAt: data.updated_at,
      },
    }, {
      headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" }
    });
  });
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  return withApiAuth(request, async ({ companyId, supabase }) => {
    const body = await request.json();

    const updateData: Record<string, unknown> = {};
    if (body.status !== undefined) updateData.status = body.status;
    if (body.issueDate !== undefined) updateData.issue_date = body.issueDate;
    if (body.expiryDate !== undefined) updateData.expiry_date = body.expiryDate;
    if (body.lineItems !== undefined) updateData.line_items = body.lineItems;
    if (body.subtotal !== undefined) updateData.subtotal = body.subtotal;
    if (body.taxRate !== undefined) updateData.tax_rate = body.taxRate;
    if (body.taxAmount !== undefined) updateData.tax_amount = body.taxAmount;
    if (body.total !== undefined) updateData.total = body.total;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.terms !== undefined) updateData.terms = body.terms;
    if (body.address !== undefined) updateData.address = body.address;

    const { data, error } = await supabase
      .from("estimates")
      .update(updateData)
      .eq("id", id)
      .eq("company_id", companyId)
      .select("id, customer_id, estimate_number, status, issue_date, expiry_date, line_items, subtotal, tax_rate, tax_amount, total, notes, terms, address, created_at, updated_at")
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        id: data.id, customerId: data.customer_id,
        estimateNumber: data.estimate_number, status: data.status,
        issueDate: data.issue_date, expiryDate: data.expiry_date,
        lineItems: data.line_items || [], subtotal: data.subtotal,
        taxRate: data.tax_rate, taxAmount: data.tax_amount, total: data.total,
        notes: data.notes, terms: data.terms, address: data.address,
        createdAt: data.created_at, updatedAt: data.updated_at,
      },
    });
  });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  return withApiAuth(request, async ({ companyId, supabase }) => {
    const { data: existing } = await supabase
      .from("estimates")
      .select("id")
      .eq("id", id)
      .eq("company_id", companyId)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
    }

    const { error } = await supabase.from("estimates").delete().eq("id", id).eq("company_id", companyId);

    if (error) {
      return NextResponse.json({ error: "Failed to delete estimate" }, { status: 500 });
    }

    return NextResponse.json({ data: { id, deleted: true } });
  });
}
