import { createClient } from "@/lib/supabase/server";

const CONSULTATION_FIELDS = "id, company_id, customer_id, estimate_id, title, purpose, public_token, daily_room_name, daily_room_url, status, scheduled_at, started_at, ended_at, duration_seconds, expires_at, host_user_id, host_name, customer_name, customer_email, customer_phone, created_at";

export async function getConsultation(id: string, companyId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("consultations")
    .select(CONSULTATION_FIELDS)
    .eq("id", id)
    .eq("company_id", companyId)
    .limit(1)
    .single();

  if (error) throw new Error("Consultation not found");
  return data;
}
