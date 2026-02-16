import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { PublicEstimatePage } from "@/features/estimate-pages/components/PublicEstimatePage";

interface Props {
  params: Promise<{ id: string }>;
}

const MOCK_ESTIMATE = {
  estimateNumber: "EST-PREVIEW",
  total: 4200,
  subtotal: 4200,
  taxRate: 0,
  taxAmount: 0,
  lineItems: [
    { description: "Professional Service Package", quantity: 1, unitPrice: 3500, total: 3500 },
    { description: "Materials & Supplies", quantity: 1, unitPrice: 500, total: 500 },
    { description: "Cleanup & Disposal", quantity: 1, unitPrice: 200, total: 200 },
  ],
};

const MOCK_CUSTOMER = { name: "John Smith", email: "john@example.com", phone: "(555) 123-4567" };

const MOCK_SETTINGS = {
  allowVideoCall: true,
  allowScheduling: true,
  allowChat: true,
  allowInstantApproval: true,
  requireDeposit: false,
  depositAmount: null,
  depositType: "flat" as const,
};

export default async function TemplatePreviewPage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4000";

  const [tplRes, brandRes] = await Promise.all([
    fetch(`${base}/api/estimate-pages/templates/${id}`, {
      cache: "no-store",
      headers: { cookie: cookieHeader },
    }),
    fetch(`${base}/api/brand-kit`, {
      cache: "no-store",
      headers: { cookie: cookieHeader },
    }),
  ]);

  if (!tplRes.ok) notFound();

  const { data: template } = await tplRes.json();
  const brandData = brandRes.ok ? (await brandRes.json()).data : null;

  return (
    <PublicEstimatePage
      pageId={`template-${id}`}
      sections={template.sections || []}
      designTheme={template.designTheme || {}}
      status="draft"
      estimate={MOCK_ESTIMATE}
      customer={MOCK_CUSTOMER}
      brandKit={brandData}
      settings={MOCK_SETTINGS}
      incentiveConfig={template.incentiveConfig || null}
    />
  );
}
