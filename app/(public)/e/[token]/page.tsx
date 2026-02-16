import { notFound } from "next/navigation";
import { getPublicPageData } from "@/features/estimate-pages/queries/getPublicPageData";
import { PublicEstimatePage } from "@/features/estimate-pages/components/PublicEstimatePage";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function PublicPage({ params }: Props) {
  const { token } = await params;
  if (!token) notFound();

  const data = await getPublicPageData(token);
  if (!data) notFound();

  return (
    <PublicEstimatePage
      pageId={data.pageId}
      sections={data.sections}
      designTheme={data.designTheme}
      status={data.status}
      estimate={data.estimate}
      customer={data.customer}
      brandKit={data.brandKit}
      settings={data.settings}
      incentiveConfig={data.incentiveConfig}
      publishedAt={data.publishedAt}
      expiresAt={data.expiresAt}
    />
  );
}
