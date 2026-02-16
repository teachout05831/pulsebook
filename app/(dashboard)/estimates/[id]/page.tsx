import { getEstimateDetail } from "@/features/estimates/queries/getEstimateDetail";
import { convertEstimateDetail } from "@/features/estimates/queries/convertEstimateDetail";
import { getEstimateSettings } from "@/features/estimate-settings/queries/getEstimateSettings";
import { getTeamMemberOptions } from "@/features/estimates/queries/getTeamMemberOptions";
import { getCrewOptions } from "@/features/estimates/queries/getCrewOptions";
import { getCustomDropdowns } from "@/features/custom-dropdowns/queries/getCustomDropdowns";
import { EstimateDetailLayout } from "@/features/estimates/components/EstimateDetailLayout";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EstimateDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [rawData, settings, teamMembers, crews, dropdowns] = await Promise.all([
    getEstimateDetail(id),
    getEstimateSettings(),
    getTeamMemberOptions(),
    getCrewOptions(),
    getCustomDropdowns(),
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
