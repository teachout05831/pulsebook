"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateSchedulingPage(
  id: string,
  input: { name?: string; slug?: string; sections?: unknown[]; designTheme?: Record<string, unknown>; settings?: Record<string, unknown>; isActive?: boolean }
) {
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
    .select("company_id")
    .eq("id", id)
    .single();

  if (!existing) return { error: "Page not found" };
  if (existing.company_id !== userData.active_company_id) return { error: "Not authorized" };

  // Build update payload (snake_case for DB)
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.name !== undefined) update.name = input.name;
  if (input.slug !== undefined) update.slug = input.slug;
  if (input.sections !== undefined) update.sections = input.sections;
  if (input.designTheme !== undefined) update.design_theme = input.designTheme;
  if (input.settings !== undefined) update.settings = input.settings;
  if (input.isActive !== undefined) update.is_active = input.isActive;

  const { error } = await supabase
    .from("scheduling_pages")
    .update(update)
    .eq("id", id);

  if (error) return { error: "Failed to update" };
  return { success: true };
}
