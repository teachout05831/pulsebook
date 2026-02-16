import { redirect } from "next/navigation";
import { getWidgetBuilderData } from "@/features/consultations/queries/getWidgetBuilderData";
import { WidgetBuilderClient } from "@/features/consultations/components/WidgetBuilderClient";

interface Props {
  searchParams: Promise<{ type?: string }>;
}

export default async function WidgetBuilderPage({ searchParams }: Props) {
  const { type } = await searchParams;
  if (!type) redirect("/settings/consultations");

  const { widget, brandKit } = await getWidgetBuilderData(type);

  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <WidgetBuilderClient
        widgetType={type}
        initialSections={widget?.sections || []}
        initialTheme={widget?.designTheme || {}}
        brandKit={brandKit}
      />
    </div>
  );
}
