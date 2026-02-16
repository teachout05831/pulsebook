"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { PageSection, DesignTheme, IncentiveConfig, BrandKit, SectionType } from "@/features/estimate-pages/types";

export interface PagePreviewData {
  id: string;
  publicToken: string;
  sections: PageSection[];
  designTheme: DesignTheme;
  status: string;
  publishedAt: string | null;
  expiresAt: string | null;
  incentiveConfig: IncentiveConfig | null;
  settings: {
    allowVideoCall: boolean; allowScheduling: boolean; allowChat: boolean;
    allowInstantApproval: boolean; requireDeposit: boolean;
    depositAmount: number | null; depositType: string;
  };
  estimate: { estimateNumber: string; total: number; subtotal: number; taxRate: number; taxAmount: number; lineItems: { description: string; quantity: number; unitPrice: number; total: number }[] } | null;
  customer: { name: string; email: string; phone: string } | null;
  brandKit: BrandKit | null;
}

export function useEstimatePagePreview(pageId: string | null) {
  const [data, setData] = useState<PagePreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!pageId) return;
    setIsLoading(true);
    Promise.all([
      fetch(`/api/estimate-pages/${pageId}`).then((r) => r.json()),
      fetch("/api/brand-kit").then((r) => r.json()),
    ])
      .then(([pageRes, bkRes]) => {
        if (!pageRes.data) return;
        const p = pageRes.data;
        setData({
          id: p.id, publicToken: p.publicToken, sections: p.sections || [],
          designTheme: p.designTheme || {}, status: p.status,
          publishedAt: p.publishedAt, expiresAt: p.expiresAt,
          incentiveConfig: p.incentiveConfig,
          settings: {
            allowVideoCall: p.allowVideoCall, allowScheduling: p.allowScheduling,
            allowChat: p.allowChat, allowInstantApproval: p.allowInstantApproval,
            requireDeposit: p.requireDeposit, depositAmount: p.depositAmount,
            depositType: p.depositType || "flat",
          },
          estimate: p.estimate, customer: p.customer, brandKit: bkRes.data || null,
        });
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [pageId]);

  const saveSections = useCallback((sections: PageSection[], id: string) => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      fetch(`/api/estimate-pages/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
      }).catch(() => {});
    }, 600);
  }, []);

  const toggleSection = useCallback((sectionId: string) => {
    setData((prev) => {
      if (!prev) return prev;
      const updated = prev.sections.map((s) => s.id === sectionId ? { ...s, visible: !s.visible } : s);
      saveSections(updated, prev.id);
      return { ...prev, sections: updated };
    });
  }, [saveSections]);

  const addSection = useCallback((type: SectionType) => {
    setData((prev) => {
      if (!prev) return prev;
      const section: PageSection = {
        id: crypto.randomUUID(), type, visible: true,
        order: prev.sections.length, settings: {}, content: {},
      };
      const updated = [...prev.sections, section];
      saveSections(updated, prev.id);
      return { ...prev, sections: updated };
    });
  }, [saveSections]);

  const reorderSection = useCallback((sectionId: string, direction: "up" | "down") => {
    setData((prev) => {
      if (!prev) return prev;
      const sections = [...prev.sections].sort((a, b) => a.order - b.order);
      const currentIndex = sections.findIndex((s) => s.id === sectionId);
      if (currentIndex === -1) return prev;
      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= sections.length) return prev;
      // Swap sections
      [sections[currentIndex], sections[newIndex]] = [sections[newIndex], sections[currentIndex]];
      // Update order property
      const updated = sections.map((s, idx) => ({ ...s, order: idx }));
      saveSections(updated, prev.id);
      return { ...prev, sections: updated };
    });
  }, [saveSections]);

  const applyTemplate = useCallback(async (templateId: string) => {
    if (!data) return;
    const res = await fetch(`/api/estimate-pages/templates/${templateId}`).then((r) => r.json());
    if (!res.data) return;
    const { sections, designTheme } = res.data;
    await fetch(`/api/estimate-pages/${data.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sections, designTheme }),
    });
    setData((prev) => prev ? { ...prev, sections: sections || [], designTheme: designTheme || {} } : prev);
  }, [data]);

  const updateSettings = useCallback((patch: Partial<PagePreviewData["settings"]>) => {
    setData((prev) => {
      if (!prev) return prev;
      fetch(`/api/estimate-pages/${prev.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      }).catch(() => {});
      return { ...prev, settings: { ...prev.settings, ...patch } };
    });
  }, []);

  return { data, isLoading, toggleSection, addSection, reorderSection, applyTemplate, updateSettings };
}
