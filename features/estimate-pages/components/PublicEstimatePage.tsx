"use client";

import { useEffect } from "react";
import { ThemeProvider } from "./public/ThemeProvider";
import { ApprovalActions } from "./public/ApprovalActions";
import { StickyHeader } from "./public/StickyHeader";
import { ExpirationBanner } from "./public/ExpirationBanner";
import { IncentiveCountdown } from "./public/IncentiveCountdown";
import { SectionRenderer } from "./sections/SectionRenderer";
import { useSectionTracking } from "../hooks/useSectionTracking";
import { useIncentiveTimer } from "../hooks/useIncentiveTimer";
import { TierSelectionProvider } from "./TierSelectionContext";
import type { PageSection, DesignTheme, IncentiveConfig } from "../types";

interface Props {
  pageId: string;
  sections: PageSection[];
  designTheme: DesignTheme;
  status: string;
  estimate: {
    estimateNumber: string;
    total: number;
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    lineItems: { description: string; quantity: number; unitPrice: number; total: number }[];
  } | null;
  customer: { name: string; email: string; phone: string } | null;
  brandKit: {
    logoUrl: string | null;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    headingFont: string | null;
    companyDescription: string | null;
    tagline: string | null;
    companyPhotos: string[];
    googleRating: number | null;
    googleReviewCount: number | null;
    certifications: string[];
    insuranceInfo: string | null;
    socialLinks: Record<string, string>;
    heroImageUrl: string | null;
  } | null;
  settings: {
    allowVideoCall: boolean;
    allowScheduling: boolean;
    allowChat: boolean;
    allowInstantApproval: boolean;
    requireDeposit: boolean;
    depositAmount: number | null;
    depositType: string;
  };
  incentiveConfig?: IncentiveConfig | null;
  publishedAt?: string | null;
  expiresAt?: string | null;
  companyPhone?: string;
  isPreview?: boolean;
}

export function PublicEstimatePage({
  pageId, sections, designTheme, status,
  estimate, customer, brandKit, settings, incentiveConfig,
  publishedAt, expiresAt, companyPhone, isPreview,
}: Props) {
  const { trackRef } = useSectionTracking({ pageId, enabled: !isPreview });
  const incentive = useIncentiveTimer({ incentiveConfig: incentiveConfig || null, estimateTotal: estimate?.total || 0, publishedAt });
  const iData = incentive.isEnabled ? { activeTier: incentive.activeTier, discountedTotal: incentive.discountedTotal, savingsAmount: incentive.savingsAmount, isExpired: incentive.isExpired } : null;

  useEffect(() => {
    if (isPreview) return;
    const dt = window.innerWidth < 768 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop";
    fetch(`/api/estimate-pages/${pageId}/analytics`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ eventType: "page_view", deviceType: dt, referrer: document.referrer || null }) }).catch(() => {});
  }, [pageId, isPreview]);

  const hasApprovalSection = (sections || []).some((s) => s.type === "approval" && s.visible);

  return (
    <ThemeProvider theme={designTheme} brandKit={brandKit}>
      <TierSelectionProvider>
      {!isPreview && <ExpirationBanner expiresAt={expiresAt || null} secondaryColor={brandKit?.secondaryColor} />}
      {!isPreview && incentive.isEnabled && incentiveConfig && (
        <IncentiveCountdown activeTier={incentive.activeTier} savingsAmount={incentive.savingsAmount}
          timeRemaining={incentive.timeRemaining} showCountdown={incentiveConfig.showCountdown}
          showSavings={incentiveConfig.showSavings} isExpired={incentive.isExpired} expiredMessage={incentiveConfig.expiredMessage} />
      )}
      {!isPreview && <StickyHeader
        brandKit={brandKit}
        phone={companyPhone}
        estimateNumber={estimate?.estimateNumber}
      />}
      <div
        className="min-h-screen bg-gray-50"
        style={{ fontFamily: "var(--body-font, 'Inter, sans-serif')" }}
      >
        {(sections || []).map((section) => {
          if (!section.visible) return null;

          if (section.type === "approval") {
            return (
              <div key={section.id} ref={trackRef(section.id)} data-section-type="approval">
                <ApprovalActions pageId={pageId} status={status} allowInstantApproval={settings.allowInstantApproval}
                  requireDeposit={settings.requireDeposit} depositAmount={settings.depositAmount} depositType={settings.depositType}
                  total={estimate?.total || 0} discountedTotal={iData?.discountedTotal} savingsAmount={iData?.savingsAmount}
                  activeTierLabel={iData?.activeTier?.label} />
              </div>
            );
          }

          return (
            <div key={section.id} ref={trackRef(section.id)}>
              <SectionRenderer
                section={section} brandKit={brandKit} estimate={estimate}
                customer={customer} pageId={pageId} incentiveData={iData}
              />
            </div>
          );
        })}

        {!hasApprovalSection && (
          <ApprovalActions pageId={pageId} status={status} allowInstantApproval={settings.allowInstantApproval}
            requireDeposit={settings.requireDeposit} depositAmount={settings.depositAmount} depositType={settings.depositType}
            total={estimate?.total || 0} discountedTotal={iData?.discountedTotal} savingsAmount={iData?.savingsAmount}
            activeTierLabel={iData?.activeTier?.label} />
        )}
      </div>
      </TierSelectionProvider>
    </ThemeProvider>
  );
}
