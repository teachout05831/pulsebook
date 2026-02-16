import { createClient } from "@/lib/supabase/server";
import type { AuthContext } from "@/lib/supabase/getAuthContext";

const FIELDS =
  "id, company_id, customer_id, title, description, status, scheduled_date, scheduled_time, arrival_window, estimated_duration, address, assigned_to, assigned_crew_id, dispatched_at, notes, custom_fields, tags, is_recurring_template, recurrence_config, parent_job_id, instance_date, line_items, pricing_model, resources, subtotal, tax_rate, tax_amount, total, deposit_type, deposit_amount, deposit_paid, applied_fees, source_estimate_id, internal_notes, customer_notes, crew_notes, crew_feedback, latitude, longitude, created_at, updated_at";

const JOINS = "customers(name, email, phone)";

export async function getJobDetail(id: string, auth?: AuthContext) {
  let supabase, companyId;
  if (auth) {
    supabase = auth.supabase;
    companyId = auth.companyId;
  } else {
    supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const { data: userData } = await supabase.from("users").select("active_company_id").eq("id", user.id).limit(1).single();
    if (!userData?.active_company_id) throw new Error("No active company");
    companyId = userData.active_company_id;
  }

  const { data, error } = await supabase
    .from("jobs")
    .select(`${FIELDS}, ${JOINS}`)
    .eq("id", id)
    .eq("company_id", companyId)
    .limit(1)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Job not found");

  return data;
}
