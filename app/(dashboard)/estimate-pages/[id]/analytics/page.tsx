import { PageAnalytics } from "@/features/estimate-pages/components/analytics/PageAnalytics";

export default async function EstimatePageAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <PageAnalytics pageId={id} />;
}
