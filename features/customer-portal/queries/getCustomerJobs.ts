import type { SupabaseClient } from "@supabase/supabase-js";

export async function getCustomerJobs(
  supabase: SupabaseClient,
  customerId: string,
  companyId: string
) {
  const { data, error } = await supabase
    .from("jobs")
    .select("id, title, status, scheduled_date, assigned_crew_id, crews(name)")
    .eq("customer_id", customerId)
    .eq("company_id", companyId)
    .order("scheduled_date", { ascending: false, nullsFirst: false })
    .limit(50);

  if (error) throw error;
  return data;
}
