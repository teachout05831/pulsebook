import type { SupabaseClient } from "@supabase/supabase-js";

export async function getCustomerAppointments(
  supabase: SupabaseClient,
  customerId: string,
  companyId: string
) {
  const today = new Date().toISOString().split("T")[0];

  // Parallel fetch: upcoming jobs + pending consultations
  const [jobsRes, consultationsRes] = await Promise.all([
    supabase
      .from("jobs")
      .select("id, title, status, scheduled_date")
      .eq("customer_id", customerId)
      .eq("company_id", companyId)
      .gte("scheduled_date", today)
      .in("status", ["scheduled", "in_progress"])
      .order("scheduled_date", { ascending: true })
      .limit(20),

    supabase
      .from("consultations")
      .select("id, title, status, scheduled_at, public_token")
      .eq("customer_id", customerId)
      .eq("company_id", companyId)
      .in("status", ["pending", "active"])
      .order("scheduled_at", { ascending: true })
      .limit(20),
  ]);

  if (jobsRes.error) throw jobsRes.error;
  if (consultationsRes.error) throw consultationsRes.error;

  return {
    jobs: jobsRes.data || [],
    consultations: consultationsRes.data || [],
  };
}
