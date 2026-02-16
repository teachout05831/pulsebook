"use client";

import { Star, Images, FileText, ExternalLink, ListChecks, Play, BookOpen, Handshake, type LucideIcon } from "lucide-react";

// Re-export types from canonical location for backward compatibility
export type { WidgetType, PresetWidgetType, ProcessStep, FaqItem, CallWidget, VideoAssetData } from "../types";
import type { PresetWidgetType } from "../types";

export const WIDGET_ICONS: Record<PresetWidgetType, LucideIcon> = {
  reviews: Star,
  portfolio: Images,
  estimate: FileText,
  process: ListChecks,
  video: Play,
  faq: BookOpen,
  contract: Handshake,
  custom_link: ExternalLink,
};

export const WIDGET_META: Record<PresetWidgetType, { label: string; description: string; color: string }> = {
  reviews: { label: "Reviews", description: "Show your testimonials and Google rating", color: "#facc15" },
  portfolio: { label: "Portfolio", description: "Display work photos and before/after", color: "#38bdf8" },
  estimate: { label: "Estimate", description: "Show the linked estimate during the call", color: "#a78bfa" },
  process: { label: "Our Process", description: "Step-by-step visual walkthrough of how you work", color: "#34d399" },
  video: { label: "Video", description: "Show a company intro or project video", color: "#f472b6" },
  faq: { label: "FAQ", description: "Common questions and answers", color: "#fb923c" },
  contract: { label: "Contract", description: "Show service agreement for signing", color: "#60a5fa" },
  custom_link: { label: "Custom", description: "Custom content or embedded page", color: "#94a3b8" },
};
