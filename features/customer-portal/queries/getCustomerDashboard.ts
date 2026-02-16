import type { SupabaseClient } from "@supabase/supabase-js";

export async function getCustomerDashboard(
  supabase: SupabaseClient,
  customerId: string,
  companyId: string
) {
  // Run all counts in parallel
  const [estimatesRes, jobsRes, invoicesRes, lifetimeRes] = await Promise.all([
    supabase
      .from("estimates")
      .select("id", { count: "exact", head: true })
      .eq("customer_id", customerId)
      .eq("company_id", companyId)
      .in("status", ["draft", "sent", "pending"]),

    supabase
      .from("jobs")
      .select("id", { count: "exact", head: true })
      .eq("customer_id", customerId)
      .eq("company_id", companyId)
      .in("status", ["scheduled", "in_progress"]),

    supabase
      .from("invoices")
      .select("id", { count: "exact", head: true })
      .eq("customer_id", customerId)
      .eq("company_id", companyId)
      .in("status", ["sent", "overdue"]),

    supabase
      .from("invoices")
      .select("total")
      .eq("customer_id", customerId)
      .eq("company_id", companyId)
      .eq("status", "paid")
      .limit(500),
  ]);

  if (estimatesRes.error) throw estimatesRes.error;
  if (jobsRes.error) throw jobsRes.error;
  if (invoicesRes.error) throw invoicesRes.error;
  if (lifetimeRes.error) throw lifetimeRes.error;

  const lifetime_total = (lifetimeRes.data || []).reduce(
    (sum: number, inv: { total: number }) => sum + (inv.total || 0),
    0
  );

  return {
    pending_estimates: estimatesRes.count || 0,
    active_jobs: jobsRes.count || 0,
    unpaid_invoices: invoicesRes.count || 0,
    lifetime_total,
  };
}
