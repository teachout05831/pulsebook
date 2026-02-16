import type { SupabaseClient } from "@supabase/supabase-js";

export async function getTechJobContracts(
  supabase: SupabaseClient,
  companyId: string,
  jobId: string
) {
  const { data, error } = await supabase
    .from("contract_instances")
    .select("id, status, template_snapshot, signing_token, created_at")
    .eq("company_id", companyId)
    .eq("job_id", jobId)
    .neq("status", "cancelled")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) throw error;
  return data || [];
}
