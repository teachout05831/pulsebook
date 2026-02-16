"use client";

import { useState, ReactNode, useMemo } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { useEstimatePagePreview } from "../hooks/useEstimatePagePreview";
import { PublicEstimatePage } from "@/features/estimate-pages/components/PublicEstimatePage";
import { calculateTotals } from "../utils/calculateTotals";
import type { EstimateDetail } from "@/types/estimate";

interface Props {
  estimate: EstimateDetail;
  children: ReactNode;
  pageData: ReturnType<typeof useEstimatePagePreview>['data'];
  isLoadingPage: boolean;
}

export function SplitViewLayout({ estimate, children, pageData, isLoadingPage }: Props) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const data = pageData;
  const isLoading = isLoadingPage;

  // Calculate live totals from current estimate data
  const liveEstimateData = useMemo(() => {
    const totals = calculateTotals({
      lineItems: estimate.lineItems || [],
      resources: estimate.resources || {},
      pricingModel: estimate.pricingModel || "flat",
      taxRate: estimate.taxRate || 0,
      depositType: estimate.depositType as "percentage" | "fixed" | null,
      depositValue: estimate.depositAmount || 0,
      depositPaid: estimate.depositPaid || 0,
      appliedFees: estimate.appliedFees || [],
    });

    return {
      estimateNumber: estimate.estimateNumber,
      total: totals.total,
      subtotal: totals.subtotal,
      taxRate: estimate.taxRate || 0,
      taxAmount: totals.taxAmount,
      lineItems: estimate.lineItems.map(li => ({
        description: li.description,
        quantity: li.quantity,
        unitPrice: li.unitPrice,
        total: li.total,
      })),
      customerNotes: estimate.customerNotes || "",
    };
  }, [estimate]);

  const previewProps = data ? {
    pageId: data.id, sections: data.sections, designTheme: data.designTheme,
    status: data.status, estimate: liveEstimateData, customer: data.customer,
    brandKit: data.brandKit as Parameters<typeof PublicEstimatePage>[0]["brandKit"],
    settings: data.settings, incentiveConfig: data.incentiveConfig,
    publishedAt: data.publishedAt, expiresAt: data.expiresAt, isPreview: true as const,
  } : null;

  return (
    <div className="grid grid-cols-2 gap-4 items-start" style={{ height: "calc(100vh - 240px)" }}>
      {/* LEFT: Editor Panel - 50% */}
      <div className="h-full overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto pr-1 scroll-area">
          {children}
        </div>
      </div>

      {/* RIGHT: Live Preview - 50% */}
      <div className="h-full overflow-hidden rounded-lg border bg-white">
        <div className="bg-slate-800 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <span className="text-xs text-slate-400 ml-1">Customer Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-green-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Live
            </span>
            <div className="flex items-center gap-0.5 bg-slate-700 rounded-md p-0.5 ml-2">
              <button onClick={() => setDevice("desktop")} title="Desktop"
                className={`p-1.5 rounded transition-colors ${device === "desktop" ? "bg-slate-500 text-white" : "text-slate-400 hover:text-slate-300"}`}>
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setDevice("mobile")} title="Mobile"
                className={`p-1.5 rounded transition-colors ${device === "mobile" ? "bg-slate-500 text-white" : "text-slate-400 hover:text-slate-300"}`}>
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && !data && (
          <div className="flex items-center justify-center py-20 px-8 text-center">
            <div>
              <p className="text-sm text-slate-600 mb-1">No customer page yet</p>
              <p className="text-xs text-slate-400">Create an estimate page to see live preview</p>
            </div>
          </div>
        )}

        {!isLoading && data && previewProps && device === "desktop" && (
          <div className="overflow-y-auto h-[calc(100%-44px)] scroll-area">
            <PublicEstimatePage {...previewProps} />
          </div>
        )}

        {!isLoading && data && previewProps && device === "mobile" && (
          <div className="bg-slate-100 h-[calc(100%-44px)] flex justify-center items-start py-6 overflow-y-auto">
            <div className="w-[375px] rounded-[2.5rem] border-[8px] border-slate-900 overflow-hidden shadow-2xl bg-white flex-shrink-0">
              <div className="bg-slate-900 flex justify-center py-2">
                <div className="w-24 h-1.5 bg-slate-700 rounded-full" />
              </div>
              <div className="max-h-[750px] overflow-y-auto scroll-area">
                <PublicEstimatePage {...previewProps} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
