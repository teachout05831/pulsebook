import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCustomerUser } from "@/lib/auth/getCustomerUser";
import { getCustomerInvoices } from "@/features/customer-portal/queries/getCustomerInvoices";

export async function GET() {
  const supabase = await createClient();
  const customerUser = await getCustomerUser(supabase);
  if (!customerUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getCustomerInvoices(
      supabase,
      customerUser.customerId,
      customerUser.companyId
    );

    // snake_case → camelCase conversion here
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
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}
