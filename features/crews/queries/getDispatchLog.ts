import { createClient } from "@/lib/supabase/server";

export async function getDispatchLog(date: string) {
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
    .from("dispatch_logs")
    .select("id, company_id, dispatch_date, dispatched_at, dispatched_by, notes")
    .eq("company_id", userData.active_company_id)
    .eq("dispatch_date", date)
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows
  return data || null;
}
