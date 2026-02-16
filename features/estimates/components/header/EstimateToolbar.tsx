"use client";

import { ModeToggle } from "../ModeToggle";
import type { EstimateMode } from "../ModeToggle";
import { SectionsDropdown } from "./SectionsDropdown";
import { TemplateDropdown } from "./TemplateDropdown";
import type { EstimateTemplate } from "./TemplateDropdown";
import type { SectionType } from "@/features/estimate-pages/types/core";

interface Section {
  id: string;
  type: string;
  visible: boolean;
  title?: string;
  order: number;
}

interface Props {
  mode: EstimateMode;
  onModeChange: (mode: EstimateMode) => void;
  estimateId: string;
  sections: Section[];
  onToggleSection: (sectionId: string, visible: boolean) => void;
  onAddSection?: (type: SectionType) => void;
  onReorderSection?: (sectionId: string, direction: "up" | "down") => void;
  templates: EstimateTemplate[];
  activeTemplateId: string | null;
  onSwitchTemplate: (templateId: string) => void;
  hasPage: boolean;
}

export function EstimateToolbar({ mode, onModeChange, estimateId, sections, onToggleSection, onAddSection, onReorderSection, templates, activeTemplateId, onSwitchTemplate, hasPage }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {hasPage && (
          <>
            <SectionsDropdown
              estimateId={estimateId}
              sections={sections}
              onToggle={onToggleSection}
              onAddSection={onAddSection}
              onReorder={onReorderSection}
            />
            <TemplateDropdown
              templates={templates}
              activeTemplateId={activeTemplateId}
              onSwitch={onSwitchTemplate}
            />
          </>
        )}
      </div>
      <ModeToggle mode={mode} onModeChange={onModeChange} />
    </div>
  );
}
