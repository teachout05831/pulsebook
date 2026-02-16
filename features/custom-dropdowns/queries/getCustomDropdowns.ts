import { createClient } from "@/lib/supabase/server";
import { defaultCustomDropdowns } from "@/types/company";
import type { CustomDropdowns } from "@/types/company";

export async function getCustomDropdowns(): Promise<CustomDropdowns> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: userData } = await supabase
    .from("users")
    .select("active_company_id")
    .eq("id", user.id)
    .limit(1)
    .single();
  if (!userData?.active_company_id) throw new Error("No active company");

  const { data, error } = await supabase
    .from("companies")
    .select("settings")
    .eq("id", userData.active_company_id)
    .limit(1)
    .single();

  if (error) throw error;

  const saved = (data?.settings as Record<string, unknown>)?.customDropdowns as Partial<CustomDropdowns> | undefined;

  return {
    serviceTypes: saved?.serviceTypes?.length ? saved.serviceTypes : defaultCustomDropdowns.serviceTypes,
    sources: saved?.sources?.length ? saved.sources : defaultCustomDropdowns.sources,
    leadStatuses: saved?.leadStatuses?.length ? saved.leadStatuses : defaultCustomDropdowns.leadStatuses,
  };
}
