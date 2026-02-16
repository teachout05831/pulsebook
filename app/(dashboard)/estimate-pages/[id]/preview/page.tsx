import { cookies } from "next/headers";
import { PreviewFrame } from "@/features/estimate-pages/components/page-builder/PreviewFrame";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EstimatePagePreviewPage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const [pageRes, brandRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4000"}/api/estimate-pages/${id}`, {
      cache: "no-store",
      headers: { cookie: cookieHeader },
    }),
    fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4000"}/api/brand-kit`, {
      cache: "no-store",
      headers: { cookie: cookieHeader },
    }),
  ]);

  if (!pageRes.ok) {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">Page not found</div>;
  }

  const { data: page } = await pageRes.json();
  const brandData = brandRes.ok ? (await brandRes.json()).data : null;

  return (
    <PreviewFrame
      pageId={id}
      publicToken={page.publicToken}
      sections={page.sections || []}
      designTheme={page.designTheme || {}}
      status={page.status}
      estimate={page.estimate || null}
      customer={page.customer || null}
      brandKit={brandData}
      settings={{
        allowVideoCall: page.allowVideoCall ?? false,
        allowScheduling: page.allowScheduling ?? false,
        allowChat: page.allowChat ?? false,
        allowInstantApproval: page.allowInstantApproval ?? true,
        requireDeposit: page.requireDeposit ?? false,
        depositAmount: page.depositAmount ?? null,
        depositType: page.depositType ?? "flat",
      }}
    />
  );
}
