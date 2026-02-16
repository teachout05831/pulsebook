import { notFound } from "next/navigation";
import { getPublicConsultation } from "@/features/consultations/queries/getPublicConsultation";
import { PublicConsultationPage } from "@/features/consultations/components/PublicConsultationPage";
import type { PublicConsultationData } from "@/features/consultations/types";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function ConsultationPage({ params }: Props) {
  const { token } = await params;
  if (!token) notFound();

  const data = await getPublicConsultation(token);
  if (!data) notFound();

  return <PublicConsultationPage consultation={data as PublicConsultationData} />;
}
