"use server";

import { createClient } from "@/lib/supabase/server";

const CAMEL_TO_SNAKE: Record<string, string> = {
  pricingModel: "pricing_model",
  bindingType: "binding_type",
  leadStatus: "lead_status",
  serviceType: "service_type",
  salesPersonId: "sales_person_id",
  estimatorId: "estimator_id",
  scheduledDate: "scheduled_date",
  scheduledTime: "scheduled_time",
  issueDate: "issue_date",
  expiryDate: "expiry_date",
  internalNotes: "internal_notes",
  customerNotes: "customer_notes",
  crewNotes: "crew_notes",
  crewFeedback: "crew_feedback",
  lineItems: "line_items",
  depositType: "deposit_type",
  depositAmount: "deposit_amount",
  customFields: "custom_fields",
};

const ALLOWED_KEYS = new Set([
  ...Object.keys(CAMEL_TO_SNAKE),
  "status", "source", "tags", "notes", "terms", "address", "resources",
]);

export async function updateEstimate(id: string, input: Record<string, unknown>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: userData } = await supabase
    .from("users")
    .select("active_company_id")
    .eq("id", user.id)
    .single();
  if (!userData?.active_company_id) return { error: "No active company" };

  const { data: existing } = await supabase
    .from("estimates")
    .select("company_id")
    .eq("id", id)
    .single();

  if (!existing) return { error: "Estimate not found" };
  if (existing.company_id !== userData.active_company_id) return { error: "Not authorized" };

  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const [key, value] of Object.entries(input)) {
    if (!ALLOWED_KEYS.has(key)) continue;
    const dbKey = CAMEL_TO_SNAKE[key] || key;
    updateData[dbKey] = value;
  }

  const { data, error } = await supabase
    .from("estimates")
    .update(updateData)
    .eq("id", id)
    .select("id, status, updated_at")
    .single();

  if (error) return { error: "Failed to update estimate" };
  return { success: true, data };
}
