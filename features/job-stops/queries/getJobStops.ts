import { SupabaseClient } from "@supabase/supabase-js";

const STOP_FIELDS = "id, job_id, stop_order, address, notes, stop_type, created_at";

export async function getJobStops(
  supabase: SupabaseClient,
  companyId: string,
  jobId: string
) {
  // Verify job belongs to company
  const { data: job } = await supabase
    .from("jobs")
    .select("id")
    .eq("id", jobId)
    .eq("company_id", companyId)
    .single();

  if (!job) throw new Error("Job not found");

  const { data, error } = await supabase
    .from("job_stops")
    .select(STOP_FIELDS)
    .eq("company_id", companyId)
    .eq("job_id", jobId)
    .order("stop_order", { ascending: true })
    .limit(20);

  if (error) throw error;
  return data;
}
