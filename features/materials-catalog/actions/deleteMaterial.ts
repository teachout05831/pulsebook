"use server";

import { createClient } from "@/lib/supabase/server";

export async function deleteMaterial(id: string) {
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
    .from("materials_catalog")
    .select("company_id")
    .eq("id", id)
    .single();

  if (!existing) return { error: "Material not found" };
  if (existing.company_id !== userData.active_company_id) return { error: "Not authorized" };

  const { error } = await supabase
    .from("materials_catalog")
    .delete()
    .eq("id", id);

  if (error) return { error: "Failed to delete material" };
  return { success: true };
}
