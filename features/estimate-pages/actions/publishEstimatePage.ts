"use server";

import { createClient } from "@/lib/supabase/server";

export async function publishEstimatePage(pageId: string, companyId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Verify companyId matches user's active company
  const { data: userData } = await supabase.from("users").select("active_company_id").eq("id", user.id).single();
  if (userData?.active_company_id !== companyId) return { error: "Not authorized" };

  // Ownership check
  const { data: existing } = await supabase
    .from("estimate_pages")
    .select("id, status, public_token")
    .eq("id", pageId)
    .eq("company_id", companyId)
    .single();

  if (!existing) return { error: "Page not found" };

  if (existing.status !== "draft") {
    return { error: "Only draft pages can be published" };
  }

  const { error } = await supabase
    .from("estimate_pages")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", pageId);

  if (error) return { error: "Failed to publish page" };
  return { success: true, publicToken: existing.public_token };
}
