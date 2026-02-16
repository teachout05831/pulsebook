import type { SupabaseClient } from "@supabase/supabase-js";

export async function getCustomerContracts(
  supabase: SupabaseClient,
  customerId: string,
  companyId: string
) {
  const { data, error } = await supabase
    .from("contract_instances")
    .select(
      "id, status, signing_token, signed_at, created_at, contract_templates(name)"
    )
    .eq("customer_id", customerId)
    .eq("company_id", companyId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
}
