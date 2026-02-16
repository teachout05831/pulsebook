"use server";

import { createClient } from "@/lib/supabase/server";
import type { CustomDropdowns } from "@/types/company";

export async function saveCustomDropdowns(dropdowns: CustomDropdowns) {
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

  const { data: company } = await supabase
    .from("companies")
    .select("settings")
    .eq("id", userData.active_company_id)
    .single();

  const currentSettings = (company?.settings as Record<string, unknown>) || {};
  const updatedSettings = { ...currentSettings, customDropdowns: dropdowns };

  const { error } = await supabase
    .from("companies")
    .update({ settings: updatedSettings })
    .eq("id", userData.active_company_id);

  if (error) return { error: "Failed to save dropdowns" };
  return { success: true };
}
