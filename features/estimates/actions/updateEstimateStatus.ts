"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateEstimateStatus(id: string, status: string) {
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

  if (!status) return { error: "Status is required" };

  const { error } = await supabase
    .from("estimates")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: "Failed to update status" };
  return { success: true };
}
