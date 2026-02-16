"use client";

import { useState, useCallback, useMemo } from "react";
import type { PageSection, SectionType } from "../types";
import { getPresetSectionDefaults, getDefaultContent } from "../constants";

export function usePageBuilderSections(
  initialSections: PageSection[],
  activePresetId: string | undefined,
  onDirty: () => void
) {
  const [sections, setSections] = useState<PageSection[]>(initialSections);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const selectedSection = useMemo(
    () => sections.find((s) => s.id === selectedSectionId) || null,
    [sections, selectedSectionId]
  );

  const addSection = useCallback((type: SectionType) => {
    const presetDefaults = getPresetSectionDefaults(activePresetId, type);
    const id = crypto.randomUUID();
    setSections((prev) => [...prev, {
      id, type, order: prev.length + 1,
      visible: true, settings: { ...presetDefaults }, content: getDefaultContent(type),
    }]);
    setSelectedSectionId(id);
    onDirty();
  }, [activePresetId, onDirty]);

  const removeSection = useCallback((sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId).map((s, i) => ({ ...s, order: i + 1 })));
    setSelectedSectionId((prev) => prev === sectionId ? null : prev);
    onDirty();
  }, [onDirty]);

  const updateSection = useCallback((sectionId: string, updates: Partial<PageSection> | ((s: PageSection) => Partial<PageSection>)) => {
    setSections((prev) => prev.map((s) => {
      if (s.id !== sectionId) return s;
      return { ...s, ...(typeof updates === "function" ? updates(s) : updates) };
    }));
    onDirty();
  }, [onDirty]);

  const reorderSections = useCallback((reordered: PageSection[]) => {
    setSections(reordered.map((s, i) => ({ ...s, order: i + 1 })));
    onDirty();
  }, [onDirty]);

  const toggleVisibility = useCallback((sectionId: string) => {
    setSections((prev) => prev.map((s) => s.id === sectionId ? { ...s, visible: !s.visible } : s));
    onDirty();
  }, [onDirty]);

  const addUniversalBlock = useCallback((block: { id: string; sectionType: string; settings: Record<string, unknown>; content: Record<string, unknown>; name: string }, connected: boolean) => {
    const id = crypto.randomUUID();
    setSections((prev) => [...prev, {
      id, type: block.sectionType as SectionType, order: prev.length + 1,
      visible: true, settings: { ...block.settings }, content: { ...block.content },
      ...(connected ? { universalBlockId: block.id, isConnected: true, universalBlockName: block.name } : {}),
    }]);
    setSelectedSectionId(id);
    onDirty();
  }, [onDirty]);

  const disconnectSection = useCallback((sectionId: string) => {
    setSections((prev) => prev.map((s) =>
      s.id === sectionId ? { ...s, universalBlockId: undefined, isConnected: undefined, universalBlockName: undefined } : s
    ));
    onDirty();
  }, [onDirty]);

  const applyPresetToSections = useCallback((sectionDefaults: Record<string, Record<string, unknown>>) => {
    setSections((prev) => prev.map((s) => {
      const d = sectionDefaults[s.type as SectionType];
      return d && !s.settings.variant ? { ...s, settings: { ...s.settings, ...d } } : s;
    }));
    onDirty();
  }, [onDirty]);

  return {
    sections, selectedSection, selectedSectionId, setSelectedSectionId,
    addSection, removeSection, updateSection, reorderSections, toggleVisibility,
    addUniversalBlock, disconnectSection, applyPresetToSections,
  };
}
