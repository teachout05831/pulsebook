import { createClient } from "./server";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface AuthContext {
  supabase: SupabaseClient;
  userId: string;
  companyId: string;
}

export async function getAuthContext(): Promise<AuthContext> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: userData } = await supabase
    .from("users")
    .select("active_company_id")
    .eq("id", user.id)
    .single();
  if (!userData?.active_company_id) throw new Error("No active company");

  return { supabase, userId: user.id, companyId: userData.active_company_id };
}
