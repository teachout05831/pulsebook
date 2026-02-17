import { getEstimateDetail } from "@/features/estimates/queries/getEstimateDetail";
import { convertEstimateDetail } from "@/features/estimates/queries/convertEstimateDetail";
import { getEstimateSettings } from "@/features/estimate-settings/queries/getEstimateSettings";
import { getTeamMemberOptions } from "@/features/estimates/queries/getTeamMemberOptions";
import { getCrewOptions } from "@/features/estimates/queries/getCrewOptions";
import { getCustomDropdowns } from "@/features/custom-dropdowns/queries/getCustomDropdowns";
import { EstimateDetailLayout } from "@/features/estimates/components/EstimateDetailLayout";
import { defaultEstimateBuilderSettings, defaultCustomDropdowns } from "@/types/company";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function safeQuery<T>(name: string, fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    console.error(`[EstimateDetail] ${name} failed:`, e);
    return fallback;
  }
}

export default async function EstimateDetailPage({ params }: PageProps) {
  const { id } = await params;

  // getEstimateDetail is critical — let errors propagate with logging
  let rawData;
  try {
    rawData = await getEstimateDetail(id);
  } catch (e) {
    console.error("[EstimateDetail] getEstimateDetail failed:", e);
    throw e;
  }

  const [settings, teamMembers, crews, dropdowns] = await Promise.all([
    safeQuery("getEstimateSettings", () => getEstimateSettings(), { ...defaultEstimateBuilderSettings, multiStopRoutesEnabled: false }),
    safeQuery("getTeamMemberOptions", () => getTeamMemberOptions(), []),
    safeQuery("getCrewOptions", () => getCrewOptions(), []),
    safeQuery("getCustomDropdowns", () => getCustomDropdowns(), defaultCustomDropdowns),
  ]);

  const estimate = convertEstimateDetail(rawData as Record<string, unknown>);

  return (
    <EstimateDetailLayout
      initialEstimate={estimate}
      resourceFields={settings.resourceFields}
      pricingCategories={settings.pricingCategories}
      teamMembers={teamMembers}
      crews={crews}
      dropdowns={dropdowns}
      assignmentFields={settings.assignmentFields}
    />
  );
}
