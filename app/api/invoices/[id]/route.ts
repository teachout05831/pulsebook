import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

interface RouteParams {
  params: Promise<{ id: string }>;
}

interface Payment {
  id: string;
  amount: number;
  method: string;
  date: string;
  notes: string | null;
}

const INVOICE_FIELDS = "id, company_id, customer_id, job_id, estimate_id, invoice_number, status, issue_date, due_date, line_items, subtotal, tax_rate, tax_amount, total, amount_paid, amount_due, payments, notes, terms, address, created_at, updated_at";

// GET /api/invoices/[id] - Get a single invoice
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    const { data, error } = await supabase
      .from("invoices")
      .select(`${INVOICE_FIELDS}, customers(name), jobs(title)`)
      .eq("id", id)
      .eq("company_id", companyId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Handle Supabase join result
    const customer = Array.isArray(data.customers) ? data.customers[0] : data.customers;
    const job = Array.isArray(data.jobs) ? data.jobs[0] : data.jobs;

    const invoice = {
      id: data.id,
      companyId: data.company_id,
      customerId: data.customer_id,
      customerName: customer?.name || "",
      jobId: data.job_id,
      jobTitle: job?.title || null,
      estimateId: data.estimate_id,
      invoiceNumber: data.invoice_number,
      status: data.status,
      issueDate: data.issue_date,
      dueDate: data.due_date,
      lineItems: data.line_items || [],
      subtotal: data.subtotal,
      taxRate: data.tax_rate,
      taxAmount: data.tax_amount,
      total: data.total,
      amountPaid: data.amount_paid,
      amountDue: data.amount_due,
      payments: data.payments || [],
      notes: data.notes,
      terms: data.terms,
      address: data.address,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return NextResponse.json({ data: invoice }, {
      headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PATCH /api/invoices/[id] - Update an invoice
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    // Get existing invoice
    const { data: existing } = await supabase
      .from("invoices")
      .select("company_id, subtotal, tax_rate, tax_amount, total, amount_paid, payments")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    if (existing.company_id !== companyId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    // Basic field updates
    if (body.customerId !== undefined) updateData.customer_id = body.customerId;
    if (body.jobId !== undefined) updateData.job_id = body.jobId;
    if (body.estimateId !== undefined) updateData.estimate_id = body.estimateId;
    if (body.issueDate !== undefined) updateData.issue_date = body.issueDate;
    if (body.dueDate !== undefined) updateData.due_date = body.dueDate;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.terms !== undefined) updateData.terms = body.terms;
    if (body.address !== undefined) updateData.address = body.address;
    if (body.lineItems !== undefined) updateData.line_items = body.lineItems;

    // Recalculate totals if line items or tax rate changed
    let subtotal = existing.subtotal;
    let taxAmount = existing.tax_amount;
    let total = existing.total;
    const taxRate = body.taxRate ?? existing.tax_rate;

    if (body.lineItems) {
      subtotal = body.lineItems.reduce((sum: number, item: { total: number }) => sum + item.total, 0);
      taxAmount = subtotal * (taxRate / 100);
      total = subtotal + taxAmount;
      updateData.subtotal = subtotal;
      updateData.tax_rate = taxRate;
      updateData.tax_amount = taxAmount;
      updateData.total = total;
    } else if (body.taxRate !== undefined) {
      taxAmount = existing.subtotal * (taxRate / 100);
      total = existing.subtotal + taxAmount;
      updateData.tax_rate = taxRate;
      updateData.tax_amount = taxAmount;
      updateData.total = total;
    }

    // Handle payment addition
    let payments: Payment[] = existing.payments || [];
    let amountPaid = existing.amount_paid;

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
      updateData.payments = payments;
      updateData.amount_paid = amountPaid;
    }

    const amountDue = total - amountPaid;
    updateData.amount_due = amountDue;

    // Determine status based on payment
    let status = body.status ?? undefined;
    if (body.newPayment || body.status === undefined) {
      if (amountDue <= 0) {
        status = "paid";
      } else if (amountPaid > 0 && status !== "paid") {
        status = "partial";
      }
    }
    if (status !== undefined) {
      updateData.status = status;
    }

    const { data, error } = await supabase
      .from("invoices")
      .update(updateData)
      .eq("id", id)
      .select(`${INVOICE_FIELDS}, customers(name)`)
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
    }

    // Handle Supabase join result
    const customerPatch = Array.isArray(data.customers) ? data.customers[0] : data.customers;

    const invoice = {
      id: data.id,
      companyId: data.company_id,
      customerId: data.customer_id,
      customerName: customerPatch?.name || "",
      jobId: data.job_id,
      estimateId: data.estimate_id,
      invoiceNumber: data.invoice_number,
      status: data.status,
      issueDate: data.issue_date,
      dueDate: data.due_date,
      lineItems: data.line_items || [],
      subtotal: data.subtotal,
      taxRate: data.tax_rate,
      taxAmount: data.tax_amount,
      total: data.total,
      amountPaid: data.amount_paid,
      amountDue: data.amount_due,
      payments: data.payments || [],
      notes: data.notes,
      terms: data.terms,
      address: data.address,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return NextResponse.json({ data: invoice });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// DELETE /api/invoices/[id] - Delete an invoice
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    // Verify ownership
    const { data: existing } = await supabase
      .from("invoices")
      .select("company_id")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    if (existing.company_id !== companyId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { error } = await supabase
      .from("invoices")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 });
    }

    return NextResponse.json({ data: { id } });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
