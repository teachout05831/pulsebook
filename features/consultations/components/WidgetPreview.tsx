"use client";

import { WidgetPopupContent } from "./WidgetPopupContent";
import type { CallWidget } from "../types";
import type { LobbyBrandKit } from "./ConsultationLobby";

interface WidgetPreviewProps {
  widget: CallWidget;
}

const EMPTY_BRAND_KIT: LobbyBrandKit = {
  googleRating: null,
  googleReviewCount: null,
  certifications: [],
  companyPhotos: [],
  beforeAfterPhotos: [],
  testimonials: [],
  companyDescription: null,
  yearsInBusiness: null,
};

const PRIMARY_COLOR = "#2563eb";

export function WidgetPreview({ widget }: WidgetPreviewProps) {
  const hasContent = getHasContent(widget);

  if (!hasContent) {
    return (
      <div className="rounded-xl border border-dashed border-muted-foreground/20 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          {getEmptyMessage(widget.type)}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden bg-[#0a0a0f] border border-white/10">
      <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
        <span className="text-white/60 text-xs font-medium">Customer Preview</span>
        <span className="text-white/30 text-[10px] uppercase tracking-wider">Live</span>
      </div>
      <div className="p-4 max-h-[400px] overflow-y-auto">
        <WidgetPopupContent
          widget={widget}
          brandKit={EMPTY_BRAND_KIT}
          primaryColor={PRIMARY_COLOR}
          companyName="Your Company"
        />
      </div>
    </div>
  );
}

function getHasContent(widget: CallWidget): boolean {
  if (widget.type === "process") return (widget.processSteps?.length || 0) > 0;
  if (widget.type === "faq") return (widget.faqs?.length || 0) > 0;
  if (widget.type === "video") return !!(widget.videoUrl || widget.videoAssetIds?.length);
  if (widget.type === "custom_link") return !!(widget.url || widget.content);
  if (widget.type === "reviews" || widget.type === "portfolio") return true;
  if (widget.type === "estimate" || widget.type === "contract") return true;
  return false;
}

function getEmptyMessage(type: string): string {
  if (type === "process") return "Add some process steps above, then preview will appear here.";
  if (type === "faq") return "Add some FAQ items above, then preview will appear here.";
  if (type === "video") return "Select videos or enter a URL above, then preview will appear here.";
  if (type === "custom_link") return "Enter a URL or text content above, then preview will appear here.";
  return "Configure the widget to see a preview.";
}
