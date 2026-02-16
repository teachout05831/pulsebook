import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { getCustomerInvoices } from "@/features/customer-portal/queries/getCustomerInvoices";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    const { customerId } = await params;
    const { supabase, companyId } = await getAuthCompany();

    const { data: customer } = await supabase
      .from("customers")
      .select("id")
      .eq("id", customerId)
      .eq("company_id", companyId)
      .single();

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const data = await getCustomerInvoices(supabase, customerId, companyId);

    const invoices = (data || []).map((inv: Record<string, unknown>) => ({
      id: inv.id,
      invoiceNumber: inv.invoice_number,
      status: inv.status,
      total: inv.total,
      amountPaid: inv.amount_paid,
      balanceDue: inv.balance_due,
      dueDate: inv.due_date || null,
      createdAt: inv.created_at,
    }));

    return NextResponse.json({ data: invoices }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}
