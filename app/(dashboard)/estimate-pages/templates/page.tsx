import { TemplateList } from "@/features/estimate-pages/components/templates";
import { CreatePageWrapper } from "@/features/estimate-pages/components/templates/CreatePageWrapper";

interface Props {
  searchParams: Promise<{ estimateId?: string }>;
}

export default async function TemplatesPage({ searchParams }: Props) {
  const { estimateId } = await searchParams;

  return (
    <>
      <TemplateList />
      {estimateId && <CreatePageWrapper estimateId={estimateId} />}
    </>
  );
}
