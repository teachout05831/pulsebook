import { createClient } from "@/lib/supabase/server";
import { defaultTerminologySettings } from "@/types/company";
import type { TerminologySettings } from "@/types/company";

export async function getTerminology(): Promise<TerminologySettings> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
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

  const saved = (data?.settings as Record<string, unknown>)?.terminology as
    Partial<TerminologySettings> | undefined;

  if (!saved) return defaultTerminologySettings;

  return {
    estimate: { ...defaultTerminologySettings.estimate, ...saved.estimate },
    job: { ...defaultTerminologySettings.job, ...saved.job },
    customer: { ...defaultTerminologySettings.customer, ...saved.customer },
    invoice: { ...defaultTerminologySettings.invoice, ...saved.invoice },
    contract: { ...defaultTerminologySettings.contract, ...saved.contract },
    estimatePage: { ...defaultTerminologySettings.estimatePage, ...saved.estimatePage },
  };
}
