import { TemplateBuilderLoader } from "@/features/estimate-pages";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TemplateBuilderPage({ params }: Props) {
  const { id } = await params;
  return <TemplateBuilderLoader templateId={id} />;
}
