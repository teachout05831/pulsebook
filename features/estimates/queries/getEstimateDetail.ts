import { createClient } from "@/lib/supabase/server";

const FIELDS =
  "id, company_id, customer_id, estimate_number, status, pricing_model, binding_type, source, lead_status, service_type, sales_person_id, estimator_id, tags, scheduled_date, scheduled_time, issue_date, expiry_date, line_items, subtotal, tax_rate, tax_amount, total, notes, terms, address, internal_notes, customer_notes, crew_notes, crew_feedback, resources, deposit_type, deposit_amount, deposit_paid, custom_fields, applied_fees, job_id, assigned_crew_id, technician_id, created_at, updated_at";

const JOINS =
  "customers(name, email, phone), estimate_pages(id, status, public_token, published_at, first_viewed_at, approved_at), estimate_locations(id, estimate_id, location_type, label, address, city, state, zip, property_type, access_notes, lat, lng, sort_order), estimate_tasks(id, estimate_id, title, completed, due_date, assigned_to, sort_order)";

export async function getEstimateDetail(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: userData } = await supabase
    .from("users")
    .select("active_company_id")
    .eq("id", user.id)
    .limit(1)
    .single();
  if (!userData?.active_company_id) throw new Error("No active company");

  const { data, error } = await supabase
    .from("estimates")
    .select(`${FIELDS}, ${JOINS}`)
    .eq("id", id)
    .eq("company_id", userData.active_company_id)
    .limit(1)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Estimate not found");

  return data;
}
