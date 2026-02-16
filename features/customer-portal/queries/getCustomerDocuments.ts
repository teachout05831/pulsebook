import type { SupabaseClient } from "@supabase/supabase-js";

export async function getCustomerDocuments(
  supabase: SupabaseClient,
  customerId: string,
  companyId: string
) {
  // Fetch all file_uploads linked to this customer's jobs
  const { data, error } = await supabase
    .from("file_uploads")
    .select("id, file_name, file_type, storage_path, category, created_at")
    .eq("company_id", companyId)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw error;
  return data;
}
