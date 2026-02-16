import { getConsultationDetail } from '@/features/document-layer/queries/getConsultationDetail';
import { ConsultationDetailView } from '@/features/document-layer/components/ConsultationDetailView';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ConsultationDetailPage({ params }: Props) {
  const { id } = await params;
  const consultation = await getConsultationDetail(id);

  return (
    <div className="container max-w-7xl py-6">
      <ConsultationDetailView consultation={consultation} />
    </div>
  );
}
