"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Plus } from "lucide-react";
import { useEstimatePagePreview } from "../../hooks/useEstimatePagePreview";
import { TemplatePicker } from "@/features/estimate-pages/components/templates/TemplatePicker";
import { InlinePreview } from "./InlinePreview";
import { SectionControls } from "./SectionControls";
import { PageSettingsCard } from "./PageSettingsCard";
import { SendActionsCard } from "./SendActionsCard";
import type { EstimateDetail } from "@/types/estimate";

interface Props {
  estimate: EstimateDetail;
}

export function CustomerPagePreview({ estimate }: Props) {
  const router = useRouter();
  const pageLink = estimate.estimatePages?.[0] || null;
  const { data, isLoading, toggleSection } = useEstimatePagePreview(pageLink?.id || null);
  const [showPicker, setShowPicker] = useState(false);

  if (!pageLink) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No Customer Page Yet</h3>
        <p className="text-sm text-slate-500 mb-6">
          Create a customer-facing page for this estimate. Pick a template, toggle sections, and send it.
        </p>
        <button
          onClick={() => setShowPicker(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Customer Page
        </button>
        <TemplatePicker
          open={showPicker}
          onClose={() => setShowPicker(false)}
          estimateId={estimate.id}
          onCreated={(pageId) => router.push(`/estimate-pages/${pageId}`)}
        />
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 items-start">
      <InlinePreview
        pageId={data.id}
        sections={data.sections}
        designTheme={data.designTheme}
        status={data.status}
        publishedAt={data.publishedAt}
        expiresAt={data.expiresAt}
        incentiveConfig={data.incentiveConfig}
        estimate={data.estimate}
        customer={data.customer}
        brandKit={data.brandKit}
        settings={data.settings}
      />
      <div className="space-y-4">
        <SectionControls
          sections={data.sections}
          onToggle={toggleSection}
          pageId={data.id}
        />
        <PageSettingsCard
          settings={data.settings}
          expiresAt={data.expiresAt}
          status={data.status}
        />
        <SendActionsCard
          pageId={data.id}
          publicToken={data.publicToken}
          pageStatus={data.status}
          customerEmail={data.customer?.email || null}
          customerPhone={data.customer?.phone || null}
        />
      </div>
    </div>
  );
}
