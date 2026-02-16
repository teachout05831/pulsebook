import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

function escapeLike(s: string): string {
  return s.replace(/[%_\\]/g, "\\$&");
}

const INVOICE_FIELDS = "id, company_id, customer_id, job_id, estimate_id, invoice_number, status, issue_date, due_date, line_items, subtotal, tax_rate, tax_amount, total, amount_paid, amount_due, payments, notes, terms, address, created_at, updated_at";

const INVOICE_LIST_FIELDS = "id, customer_id, job_id, invoice_number, status, issue_date, due_date, total, amount_paid, amount_due";

// GET /api/invoices - List invoices with pagination, search, and filtering
export async function GET(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("_page") || "1", 10);
    const limit = parseInt(searchParams.get("_limit") || "10", 10);
    const search = searchParams.get("q") || "";
    const status = searchParams.get("status") || "";
    const customerId = searchParams.get("customerId") || "";
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";
    const offset = (page - 1) * limit;

    let query = supabase
      .from("invoices")
      .select(`${INVOICE_LIST_FIELDS}, customers(name), jobs(title)`, { count: "exact" })
      .eq("company_id", companyId);

    if (search) {
      const safe = escapeLike(search);
      query = query.or(`invoice_number.ilike.%${safe}%`);
    }
    if (status) {
      query = query.eq("status", status);
    }
    if (customerId) {
      query = query.eq("customer_id", customerId);
    }
    if (dateFrom) {
      query = query.gte("issue_date", dateFrom);
    }
    if (dateTo) {
      query = query.lte("issue_date", dateTo);
    }

    query = query
      .order("issue_date", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
    }

    // Count unpaid invoices
    const unpaidCount = (data || []).filter(
      (inv) => inv.status !== "paid" && inv.status !== "cancelled" && inv.amount_due > 0
    ).length;

    const invoices = (data || []).map((inv) => {
      const customer = Array.isArray(inv.customers) ? inv.customers[0] : inv.customers;
      const job = Array.isArray(inv.jobs) ? inv.jobs[0] : inv.jobs;
      return {
        id: inv.id,
        customerId: inv.customer_id,
        customerName: customer?.name || "",
        jobId: inv.job_id || null,
        jobTitle: job?.title || null,
        invoiceNumber: inv.invoice_number,
        status: inv.status,
        issueDate: inv.issue_date,
        dueDate: inv.due_date,
        total: inv.total,
        amountPaid: inv.amount_paid,
        amountDue: inv.amount_due,
      };
    });

    return NextResponse.json(
      { data: invoices, total: count || 0, unpaidCount },
      { headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" } }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST /api/invoices - Create a new invoice
export async function POST(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const body = await request.json();

    // Ownership check: verify customer belongs to this company
    if (body.customerId) {
      const { data: customer } = await supabase
        .from("customers")
        .select("company_id")
        .eq("id", body.customerId)
        .single();

      if (!customer || customer.company_id !== companyId) {
        return NextResponse.json({ error: "Customer not found" }, { status: 404 });
      }
    }

    // Generate invoice number
    const { data: lastInvoice } = await supabase
      .from("invoices")
      .select("invoice_number")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    let nextNum = 1;
    if (lastInvoice?.invoice_number) {
      const match = lastInvoice.invoice_number.match(/INV-(\d+)/);
      if (match) nextNum = parseInt(match[1], 10) + 1;
    }
    const invoiceNumber = `INV-${String(nextNum).padStart(3, "0")}`;

    // Calculate totals
    const lineItems = body.lineItems || [];
    const subtotal = lineItems.reduce((sum: number, item: { total: number }) => sum + item.total, 0);
    const taxRate = body.taxRate || 8;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    const { data, error } = await supabase
      .from("invoices")
      .insert({
        company_id: companyId,
        customer_id: body.customerId,
        job_id: body.jobId || null,
        estimate_id: body.estimateId || null,
        invoice_number: invoiceNumber,
        status: body.status || "draft",
        issue_date: body.issueDate || new Date().toISOString().split("T")[0],
        due_date: body.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        line_items: lineItems,
        subtotal,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total,
        amount_paid: 0,
        amount_due: total,
        payments: [],
        notes: body.notes || null,
        terms: body.terms || null,
        address: body.address || null,
      })
      .select(`${INVOICE_FIELDS}, customers(name)`)
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
    }

    // Handle Supabase join result
    const customerPost = Array.isArray(data.customers) ? data.customers[0] : data.customers;

    const invoice = {
      id: data.id,
      companyId: data.company_id,
      customerId: data.customer_id,
      customerName: customerPost?.name || "",
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

    return NextResponse.json({ data: invoice }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
