import { PageBuilderLoader } from "@/features/estimate-pages";

export default async function EstimatePageEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <PageBuilderLoader pageId={id} />;
}
