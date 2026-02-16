import { createClient } from "@/lib/supabase/server";

const CONFIG_FIELDS = "id, company_id, priority_mode, priority_weights, team_mode, crews_per_day, max_jobs_per_crew, buffer_minutes, default_duration_min, booking_window_days, min_notice_hours, time_slot_mode, auto_confirm, waitlist_enabled, crew_override_enabled, zone_enforcement, payment_required, payment_type, deposit_amount, cancellation_hours, business_hours, created_at, updated_at";

export async function getSchedulingConfig() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: userData } = await supabase
    .from("users")
    .select("active_company_id")
    .eq("id", user.id)
    .single();

  if (!userData?.active_company_id) throw new Error("No active company");

  const { data, error } = await supabase
    .from("scheduling_config")
    .select(CONFIG_FIELDS)
    .eq("company_id", userData.active_company_id)
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}
