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
      .from("estimates")
      .select("id, customer_id, estimate_number, status, issue_date, expiry_date, line_items, subtotal, tax_rate, tax_amount, total, notes, terms, address, created_at, updated_at, customers(name)", { count: "exact" })
      .eq("company_id", companyId);

    if (search) query = query.or(`estimate_number.ilike.%${search}%`);
    if (status) query = query.eq("status", status);
    if (customerId) query = query.eq("customer_id", customerId);

    query = query
      .order("issue_date", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: "Failed to fetch estimates" }, { status: 500 });
    }

    return NextResponse.json({
      data: (data || []).map((e) => {
        const customer = Array.isArray(e.customers) ? e.customers[0] : e.customers;
        return {
          id: e.id, customerId: e.customer_id,
          customerName: customer?.name || "",
          estimateNumber: e.estimate_number, status: e.status,
          issueDate: e.issue_date, expiryDate: e.expiry_date,
          lineItems: e.line_items || [], subtotal: e.subtotal,
          taxRate: e.tax_rate, taxAmount: e.tax_amount, total: e.total,
          notes: e.notes, terms: e.terms, address: e.address,
          createdAt: e.created_at, updatedAt: e.updated_at,
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

    // Generate estimate number
    const { data: last } = await supabase
      .from("estimates")
      .select("estimate_number")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    let nextNum = 1;
    if (last?.estimate_number) {
      const match = last.estimate_number.match(/EST-(\d+)/);
      if (match) nextNum = parseInt(match[1], 10) + 1;
    }
    const estimateNumber = `EST-${String(nextNum).padStart(3, "0")}`;

    const lineItems = body.lineItems || [];
    const subtotal = lineItems.reduce((sum: number, item: { total: number }) => sum + (item.total || 0), 0);
    const taxRate = body.taxRate ?? 8;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    const { data, error } = await supabase
      .from("estimates")
      .insert({
        company_id: companyId, customer_id: body.customerId,
        estimate_number: estimateNumber, status: body.status || "draft",
        issue_date: body.issueDate || new Date().toISOString().split("T")[0],
        expiry_date: body.expiryDate || null, line_items: lineItems,
        subtotal, tax_rate: taxRate, tax_amount: taxAmount, total,
        notes: body.notes || null, terms: body.terms || null,
        address: body.address || null,
      })
      .select("id, customer_id, estimate_number, status, issue_date, expiry_date, line_items, subtotal, tax_rate, tax_amount, total, notes, terms, address, created_at, updated_at")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to create estimate" }, { status: 500 });
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
    }, { status: 201 });
  });
}
