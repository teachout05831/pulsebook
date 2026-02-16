import { getAuthContext } from "@/lib/supabase/getAuthContext";
import { getJobDetail } from "@/features/jobs/queries/getJobDetail";
import { convertJobDetail } from "@/features/jobs/queries/convertJobDetail";
import { getEstimateSettings } from "@/features/estimate-settings/queries/getEstimateSettings";
import { getTeamMemberOptions } from "@/features/estimates/queries/getTeamMemberOptions";
import { getCrews } from "@/features/crews/queries/getCrews";
import { JobDetailLayout } from "@/features/jobs/components/detail/JobDetailLayout";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const auth = await getAuthContext();
  const [rawData, settings, teamMembers, crewData] = await Promise.all([
    getJobDetail(id, auth),
    getEstimateSettings(auth),
    getTeamMemberOptions(auth),
    getCrews(auth),
  ]);

  const job = convertJobDetail(rawData as Record<string, unknown>);
  const crews = (crewData.crews || []).map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }));

  return (
    <JobDetailLayout
      initialJob={job}
      resourceFields={settings.resourceFields}
      pricingCategories={settings.pricingCategories}
      multiStopRoutesEnabled={settings.multiStopRoutesEnabled}
      teamMembers={teamMembers}
      crews={crews}
    />
  );
}
