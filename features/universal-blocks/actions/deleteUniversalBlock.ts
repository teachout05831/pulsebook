"use server";

import { createClient } from "@/lib/supabase/server";

export async function deleteUniversalBlock(id: string) {
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

  if (!id) return { error: "Block ID is required" };

  // Ownership check
  const { data: existing } = await supabase
    .from("universal_blocks")
    .select("company_id")
    .eq("id", id)
    .single();
  if (!existing) return { error: "Block not found" };
  if (existing.company_id !== userData.active_company_id) return { error: "Not authorized" };

  const { error } = await supabase
    .from("universal_blocks")
    .delete()
    .eq("id", id);

  if (error) return { error: "Failed to delete block" };
  return { success: true };
}
