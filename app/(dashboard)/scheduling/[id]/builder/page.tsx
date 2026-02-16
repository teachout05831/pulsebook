import { notFound } from "next/navigation";
import { getSchedulingBuilderData } from "@/features/scheduling/queries/getSchedulingBuilderData";
import { SchedulingBuilderClient } from "@/features/scheduling/components/SchedulingBuilderClient";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = { title: "Scheduling Page Builder" };

export default async function SchedulingBuilderPage({ params }: Props) {
  const { id } = await params;
  if (!id) notFound();

  const { page, brandKit } = await getSchedulingBuilderData(id);
  if (!page) notFound();

  return (
    <div className="h-[calc(100vh-4rem)]">
      <SchedulingBuilderClient
        pageId={page.id}
        initialSections={page.sections || []}
        initialTheme={page.design_theme || {}}
        brandKit={brandKit}
      />
    </div>
  );
}
