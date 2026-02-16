import { createClient } from "@/lib/supabase/server";

const BLOCK_FIELDS =
  "id, company_id, name, description, category, section_type, settings, content, usage_count, created_by, created_at, updated_at";

export async function getUniversalBlocks(from = 0, to = 49) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: userData } = await supabase
    .from("users")
    .select("active_company_id")
    .eq("id", user.id)
    .single();
  if (!userData?.active_company_id) throw new Error("No active company");

  const { data, error } = await supabase
    .from("universal_blocks")
    .select(BLOCK_FIELDS)
    .eq("company_id", userData.active_company_id)
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return data || [];
}

export async function getUniversalBlockById(blockId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: userData } = await supabase
    .from("users")
    .select("active_company_id")
    .eq("id", user.id)
    .single();
  if (!userData?.active_company_id) throw new Error("No active company");

  const { data, error } = await supabase
    .from("universal_blocks")
    .select(BLOCK_FIELDS)
    .eq("id", blockId)
    .eq("company_id", userData.active_company_id)
    .limit(1)
    .single();

  if (error) throw error;
  return data;
}
