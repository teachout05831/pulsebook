import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { getCustomerDashboard } from "@/features/customer-portal/queries/getCustomerDashboard";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    const { customerId } = await params;
    const { supabase, companyId } = await getAuthCompany();

    // Verify customer belongs to this company
    const { data: customer } = await supabase
      .from("customers")
      .select("id")
      .eq("id", customerId)
      .eq("company_id", companyId)
      .single();

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const data = await getCustomerDashboard(supabase, customerId, companyId);

    return NextResponse.json({
      data: {
        pendingEstimates: data.pending_estimates,
        activeJobs: data.active_jobs,
        unpaidInvoices: data.unpaid_invoices,
        lifetimeTotal: data.lifetime_total,
      },
    }, {
      headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" }
    });
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }
    return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 });
  }
}
