import { redirect } from "next/navigation";
import { getPreviewConsultationData } from "@/features/consultations/queries/getPreviewConsultationData";
import { PreviewConsultationPage } from "@/features/consultations/components/PreviewConsultationPage";

export default async function ConsultationPreviewPage() {
  const data = await getPreviewConsultationData();
  if (!data) redirect("/login");

  return <PreviewConsultationPage data={data} />;
}
