import { createClient } from "@/lib/supabase/server";
import type { ArrivalWindow } from "@/types/company";
import { defaultArrivalWindows } from "@/types/company";

export async function getArrivalWindows(): Promise<ArrivalWindow[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("users")
    .select("active_company_id")
    .eq("id", user.id)
    .limit(1)
    .single();
  if (!profile?.active_company_id) throw new Error("No active company");

  const { data: company, error } = await supabase
    .from("companies")
    .select("settings")
    .eq("id", profile.active_company_id)
    .limit(1)
    .single();

  if (error) throw error;

  const settings = company?.settings as Record<string, unknown> | null;
  const windows = settings?.arrivalWindows as ArrivalWindow[] | undefined;

  return windows && windows.length > 0 ? windows : defaultArrivalWindows;
}
