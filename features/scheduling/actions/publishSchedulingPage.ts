"use server";

import { createClient } from "@/lib/supabase/server";

export async function publishSchedulingPage(id: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: userData } = await supabase
    .from("users")
    .select("active_company_id")
    .eq("id", user.id)
    .single();

  if (!userData?.active_company_id) return { error: "No active company" };

  // Ownership check
  const { data: existing } = await supabase
    .from("scheduling_pages")
    .select("company_id, status")
    .eq("id", id)
    .single();

  if (!existing) return { error: "Page not found" };
  if (existing.company_id !== userData.active_company_id) return { error: "Not authorized" };

  const { error } = await supabase
    .from("scheduling_pages")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: "Failed to publish" };
  return { success: true };
}
