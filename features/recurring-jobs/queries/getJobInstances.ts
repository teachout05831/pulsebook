import { SupabaseClient } from "@supabase/supabase-js";

const INSTANCE_FIELDS =
  "id, title, status, scheduled_date, scheduled_time, instance_date, parent_job_id, assigned_to, address";

export async function getJobInstances(
  supabase: SupabaseClient,
  companyId: string,
  parentJobId: string
) {
  const { data, error } = await supabase
    .from("jobs")
    .select(INSTANCE_FIELDS)
    .eq("company_id", companyId)
    .eq("parent_job_id", parentJobId)
    .order("instance_date", { ascending: true })
    .limit(100);

  if (error) throw error;
  return data;
}
