import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCustomerUser } from "@/lib/auth/getCustomerUser";
import { getCustomerDashboard } from "@/features/customer-portal/queries/getCustomerDashboard";

export async function GET() {
  const supabase = await createClient();
  const customerUser = await getCustomerUser(supabase);
  if (!customerUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getCustomerDashboard(
      supabase,
      customerUser.customerId,
      customerUser.companyId
    );

    // snake_case → camelCase conversion here
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
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch dashboard" },
      { status: 500 }
    );
  }
}
