"use client";

import { PublicEstimatePage } from "@/features/estimate-pages/components/PublicEstimatePage";
import type { PageSection, DesignTheme, IncentiveConfig, BrandKit } from "@/features/estimate-pages/types";

interface Props {
  pageId: string;
  sections: PageSection[];
  designTheme: DesignTheme;
  status: string;
  publishedAt: string | null;
  expiresAt: string | null;
  incentiveConfig: IncentiveConfig | null;
  estimate: {
    estimateNumber: string;
    total: number;
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    lineItems: { description: string; quantity: number; unitPrice: number; total: number }[];
  } | null;
  customer: { name: string; email: string; phone: string } | null;
  brandKit: BrandKit | null;
  settings: {
    allowVideoCall: boolean;
    allowScheduling: boolean;
    allowChat: boolean;
    allowInstantApproval: boolean;
    requireDeposit: boolean;
    depositAmount: number | null;
    depositType: string;
  };
}

export function InlinePreview({
  pageId, sections, designTheme, status, publishedAt, expiresAt,
  incentiveConfig, estimate, customer, brandKit, settings,
}: Props) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
      <div className="bg-slate-800 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <span className="text-xs text-slate-400 ml-2 truncate">
          Customer Preview
        </span>
      </div>
      <div className="max-h-[600px] overflow-y-auto">
        <PublicEstimatePage
          pageId={pageId}
          sections={sections}
          designTheme={designTheme}
          status={status}
          estimate={estimate}
          customer={customer}
          brandKit={brandKit as Parameters<typeof PublicEstimatePage>[0]["brandKit"]}
          settings={settings}
          incentiveConfig={incentiveConfig}
          publishedAt={publishedAt}
          expiresAt={expiresAt}
          isPreview
        />
      </div>
    </div>
  );
}
