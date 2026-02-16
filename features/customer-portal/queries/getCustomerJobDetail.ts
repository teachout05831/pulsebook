import type { SupabaseClient } from "@supabase/supabase-js";

export async function getCustomerJobDetail(
  supabase: SupabaseClient,
  jobId: string,
  customerId: string,
  companyId: string
) {
  // Ownership check: customer_id must match
  const { data: job, error } = await supabase
    .from("jobs")
    .select(
      "id, title, description, status, scheduled_date, scheduled_time, address, notes, assigned_crew_id, crews(name)"
    )
    .eq("id", jobId)
    .eq("customer_id", customerId)
    .eq("company_id", companyId)
    .single();

  if (error) throw error;

  // Fetch photos for this job
  const { data: photos, error: photosError } = await supabase
    .from("file_uploads")
    .select("id, storage_path, file_name, created_at")
    .eq("job_id", jobId)
    .eq("company_id", companyId)
    .eq("category", "photo")
    .order("created_at", { ascending: false })
    .limit(50);

  if (photosError) throw photosError;

  return { job, photos: photos || [] };
}
