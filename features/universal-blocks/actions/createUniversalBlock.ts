"use server";

import { createClient } from "@/lib/supabase/server";

interface CreateInput {
  name: string;
  description?: string | null;
  category?: string | null;
  section_type: string;
  settings: Record<string, unknown>;
  content: Record<string, unknown>;
}

const BLOCK_FIELDS =
  "id, company_id, name, description, category, section_type, settings, content, usage_count, created_by, created_at, updated_at";

export async function createUniversalBlock(input: CreateInput) {
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

  if (!input.name || input.name.trim().length < 1) {
    return { error: "Block name is required" };
  }
  if (!input.section_type) {
    return { error: "Section type is required" };
  }

  const { data, error } = await supabase
    .from("universal_blocks")
    .insert({
      company_id: userData.active_company_id,
      name: input.name.trim(),
      description: input.description || null,
      category: input.category || null,
      section_type: input.section_type,
      settings: input.settings || {},
      content: input.content || {},
      usage_count: 1,
      created_by: user.id,
    })
    .select(BLOCK_FIELDS)
    .single();

  if (error) {
    if (error.code === "23505") return { error: "A block with this name already exists" };
    return { error: "Failed to create block" };
  }
  return { success: true, data };
}
