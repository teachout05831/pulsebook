"use client";

import { useState, useCallback, useMemo } from "react";
import type { DesignTheme, IncentiveConfig } from "../types";
import { getPresetById } from "../constants";
import { usePageBuilderSections } from "./usePageBuilderSections";

interface UsePageBuilderProps {
  initialSections: import("../types").PageSection[];
  initialTheme: DesignTheme;
  initialIncentiveConfig: IncentiveConfig | null;
  pageId: string;
  saveEndpoint?: string;
}

export function usePageBuilder({ initialSections, initialTheme, initialIncentiveConfig, pageId, saveEndpoint }: UsePageBuilderProps) {
  const [designTheme, setDesignTheme] = useState<DesignTheme>(initialTheme);
  const [incentiveConfig, setIncentiveConfig] = useState<IncentiveConfig | null>(initialIncentiveConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const markDirty = useCallback(() => setIsDirty(true), []);
  const sec = usePageBuilderSections(initialSections, designTheme.activePresetId, markDirty);

  const applyPreset = useCallback((presetId: string) => {
    const p = getPresetById(presetId);
    if (!p) return;
    setDesignTheme(p.theme);
    sec.applyPresetToSections(p.sectionDefaults);
  }, [sec.applyPresetToSections]);

  const updateTheme = useCallback((updates: Partial<DesignTheme>) => {
    setDesignTheme((prev) => ({ ...prev, ...updates, activePresetId: undefined }));
    markDirty();
  }, [markDirty]);

  const updateIncentiveConfig = useCallback((config: IncentiveConfig) => {
    setIncentiveConfig(config); markDirty();
  }, [markDirty]);

  const endpoint = saveEndpoint || `/api/estimate-pages/${pageId}`;

  const save = useCallback(async () => {
    setIsSaving(true);
    try {
      const connected = sec.sections.filter((s) => s.universalBlockId && s.isConnected);
      await Promise.all(connected.map((s) =>
        fetch(`/api/universal-blocks/${s.universalBlockId}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ settings: s.settings, content: s.content }),
        })
      ));
      const res = await fetch(endpoint, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: sec.sections, designTheme, incentiveConfig }),
      });
      if (!res.ok) throw new Error("Save failed");
      setIsDirty(false);
      return { success: true };
    } catch {
      return { error: "Failed to save" };
    } finally {
      setIsSaving(false);
    }
  }, [endpoint, sec.sections, designTheme, incentiveConfig]);

  return useMemo(() => ({
    sections: sec.sections, designTheme, incentiveConfig, isSaving, isDirty,
    selectedSection: sec.selectedSection, selectedSectionId: sec.selectedSectionId,
    setSelectedSectionId: sec.setSelectedSectionId,
    addSection: sec.addSection, removeSection: sec.removeSection,
    updateSection: sec.updateSection, reorderSections: sec.reorderSections,
    toggleVisibility: sec.toggleVisibility, addUniversalBlock: sec.addUniversalBlock,
    disconnectSection: sec.disconnectSection,
    applyPreset, updateTheme, updateIncentiveConfig, save,
  }), [
    sec.sections, designTheme, incentiveConfig, isSaving, isDirty,
    sec.selectedSection, sec.selectedSectionId, sec.setSelectedSectionId,
    sec.addSection, sec.removeSection, sec.updateSection, sec.reorderSections,
    sec.toggleVisibility, sec.addUniversalBlock, sec.disconnectSection,
    applyPreset, updateTheme, updateIncentiveConfig, save,
  ]);
}
