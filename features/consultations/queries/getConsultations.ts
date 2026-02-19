import { createClient } from "@/lib/supabase/server";

const LIST_FIELDS =
  "id, title, purpose, status, pipeline_status, customer_name, host_name, duration_seconds, scheduled_at, created_at, estimate_id, public_token";

interface GetConsultationsParams {
  status?: string;
  customerId?: string;
  page: number;
  limit: number;
}

export async function getConsultations(
  companyId: string,
  params: GetConsultationsParams
) {
  const supabase = await createClient();
  const offset = (params.page - 1) * params.limit;
  const safeLimit = Math.min(params.limit, 50);

  let query = supabase
    .from("consultations")
    .select(LIST_FIELDS, { count: "exact" })
    .eq("company_id", companyId)
    .order("created_at", { ascending: false })
    .range(offset, offset + safeLimit - 1);

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  if (params.customerId) {
    query = query.eq("customer_id", params.customerId);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return { data: data || [], total: count || 0 };
}
