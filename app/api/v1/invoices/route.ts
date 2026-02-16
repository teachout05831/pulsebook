import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  return withApiAuth(request, async ({ companyId, supabase }) => {
    const params = request.nextUrl.searchParams;
    const page = Math.max(1, Number(params.get("page")) || 1);
    const limit = Math.min(Math.max(1, Number(params.get("limit")) || 20), 100);
    const offset = (page - 1) * limit;
    const search = params.get("q") || "";
    const status = params.get("status") || "";
    const customerId = params.get("customerId") || "";

    let query = supabase
      .from("invoices")
      .select("id, customer_id, job_id, estimate_id, invoice_number, status, issue_date, due_date, line_items, subtotal, tax_rate, tax_amount, total, amount_paid, amount_due, payments, notes, terms, address, created_at, updated_at, customers(name)", { count: "exact" })
      .eq("company_id", companyId);

    if (search) query = query.or(`invoice_number.ilike.%${search}%`);
    if (status) query = query.eq("status", status);
    if (customerId) query = query.eq("customer_id", customerId);

    query = query
      .order("issue_date", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
    }

    return NextResponse.json({
      data: (data || []).map((inv) => {
        const customer = Array.isArray(inv.customers) ? inv.customers[0] : inv.customers;
        return {
          id: inv.id, customerId: inv.customer_id,
          customerName: customer?.name || "",
          jobId: inv.job_id, estimateId: inv.estimate_id,
          invoiceNumber: inv.invoice_number, status: inv.status,
          issueDate: inv.issue_date, dueDate: inv.due_date,
          lineItems: inv.line_items || [], subtotal: inv.subtotal,
          taxRate: inv.tax_rate, taxAmount: inv.tax_amount, total: inv.total,
          amountPaid: inv.amount_paid, amountDue: inv.amount_due,
          payments: inv.payments || [],
          notes: inv.notes, terms: inv.terms, address: inv.address,
          createdAt: inv.created_at, updatedAt: inv.updated_at,
        };
      }),
      pagination: { page, limit, total: count || 0 },
    }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  });
}

export async function POST(request: NextRequest) {
  return withApiAuth(request, async ({ companyId, supabase }) => {
    const body = await request.json();

    if (!body.customerId) {
      return NextResponse.json({ error: "customerId is required" }, { status: 400 });
    }

    // Generate invoice number
    const { data: last } = await supabase
      .from("invoices")
      .select("invoice_number")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    let nextNum = 1;
    if (last?.invoice_number) {
      const match = last.invoice_number.match(/INV-(\d+)/);
      if (match) nextNum = parseInt(match[1], 10) + 1;
    }
    const invoiceNumber = `INV-${String(nextNum).padStart(3, "0")}`;

    const lineItems = body.lineItems || [];
    const subtotal = lineItems.reduce((sum: number, item: { total: number }) => sum + (item.total || 0), 0);
    const taxRate = body.taxRate ?? 8;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    const { data, error } = await supabase
      .from("invoices")
      .insert({
        company_id: companyId, customer_id: body.customerId,
        job_id: body.jobId || null, estimate_id: body.estimateId || null,
        invoice_number: invoiceNumber, status: body.status || "draft",
        issue_date: body.issueDate || new Date().toISOString().split("T")[0],
        due_date: body.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
        line_items: lineItems, subtotal, tax_rate: taxRate,
        tax_amount: taxAmount, total, amount_paid: 0, amount_due: total,
        payments: [], notes: body.notes || null, terms: body.terms || null,
        address: body.address || null,
      })
      .select("id, customer_id, job_id, estimate_id, invoice_number, status, issue_date, due_date, line_items, subtotal, tax_rate, tax_amount, total, amount_paid, amount_due, payments, notes, terms, address, created_at, updated_at")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
    }

    return NextResponse.json({
      data: {
        id: data.id, customerId: data.customer_id,
        jobId: data.job_id, estimateId: data.estimate_id,
        invoiceNumber: data.invoice_number, status: data.status,
        issueDate: data.issue_date, dueDate: data.due_date,
        lineItems: data.line_items || [], subtotal: data.subtotal,
        taxRate: data.tax_rate, taxAmount: data.tax_amount, total: data.total,
        amountPaid: data.amount_paid, amountDue: data.amount_due,
        payments: data.payments || [],
        notes: data.notes, terms: data.terms, address: data.address,
        createdAt: data.created_at, updatedAt: data.updated_at,
      },
    }, { status: 201 });
  });
}
