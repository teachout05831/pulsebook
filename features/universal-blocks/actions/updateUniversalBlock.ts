"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateUniversalBlock(id: string, input: Record<string, unknown>) {
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

  if (input.name !== undefined && (input.name as string).trim().length < 1) {
    return { error: "Block name cannot be empty" };
  }

  // Whitelist allowed fields (defense-in-depth)
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.name !== undefined) payload.name = input.name;
  if (input.description !== undefined) payload.description = input.description;
  if (input.category !== undefined) payload.category = input.category;
  if (input.settings !== undefined) payload.settings = input.settings;
  if (input.content !== undefined) payload.content = input.content;
  if (input.usage_count !== undefined) payload.usage_count = input.usage_count;

  const { data, error } = await supabase
    .from("universal_blocks")
    .update(payload)
    .eq("id", id)
    .select("id, company_id, name, description, category, section_type, settings, content, usage_count, created_by, created_at, updated_at")
    .single();

  if (error) return { error: "Failed to update block" };
  return { success: true, data };
}
