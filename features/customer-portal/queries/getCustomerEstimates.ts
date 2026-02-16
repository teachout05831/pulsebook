import type { SupabaseClient } from "@supabase/supabase-js";

export async function getCustomerEstimates(
  supabase: SupabaseClient,
  customerId: string,
  companyId: string
) {
  const { data, error } = await supabase
    .from("estimates")
    .select(
      "id, estimate_number, status, total, created_at, estimate_pages!inner(public_token)"
    )
    .eq("customer_id", customerId)
    .eq("company_id", companyId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
}
