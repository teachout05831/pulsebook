import { createClient } from "@/lib/supabase/server";
import { defaultEstimateBuilderSettings } from "@/types/company";
import type { EstimateBuilderSettings } from "@/types/company";
import type { AuthContext } from "@/lib/supabase/getAuthContext";

export async function getEstimateSettings(auth?: AuthContext): Promise<EstimateBuilderSettings & { multiStopRoutesEnabled: boolean }> {
  let supabase, companyId;
  if (auth) {
    supabase = auth.supabase;
    companyId = auth.companyId;
  } else {
    supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const { data: userData } = await supabase.from("users").select("active_company_id").eq("id", user.id).limit(1).single();
    if (!userData?.active_company_id) throw new Error("No active company");
    companyId = userData.active_company_id;
  }

  const { data, error } = await supabase
    .from("companies")
    .select("settings")
    .eq("id", companyId)
    .limit(1)
    .single();

  if (error) throw error;

  const allSettings = data?.settings as Record<string, unknown> | undefined;
  const saved = allSettings?.estimateBuilder as Partial<EstimateBuilderSettings> | undefined;
  const prebuilt = allSettings?.prebuiltFields as { multiStopRoutes?: boolean } | undefined;

  return {
    ...defaultEstimateBuilderSettings,
    ...saved,
    resourceFields: saved?.resourceFields?.length ? saved.resourceFields : defaultEstimateBuilderSettings.resourceFields,
    pricingCategories: saved?.pricingCategories?.length ? saved.pricingCategories : defaultEstimateBuilderSettings.pricingCategories,
    multiStopRoutesEnabled: prebuilt?.multiStopRoutes ?? false,
  };
}
