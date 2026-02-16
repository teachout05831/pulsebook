"use client";

import { useState } from "react";
import { toast } from "sonner";
import { usePageBuilder } from "../../hooks/usePageBuilder";
import { BuilderTopBar } from "./BuilderTopBar";
import { SectionList } from "./SectionList";
import { SectionPicker } from "./SectionPicker";
import { RightPanel } from "./RightPanel";
import { BuilderPreview } from "./BuilderPreview";
import { WidgetTemplatePicker } from "./WidgetTemplatePicker";
import { BlockLibraryDialog } from "@/features/universal-blocks/components/BlockLibraryDialog";
import { SaveAsBlockDialog } from "@/features/universal-blocks/components/SaveAsBlockDialog";
import type { UniversalBlock } from "@/features/universal-blocks/types";
import type { PageSection, DesignTheme, BrandKit, IncentiveConfig, SectionType } from "../../types";

interface PageBuilderProps {
  pageId: string;
  initialSections: PageSection[];
  initialTheme: DesignTheme;
  initialIncentiveConfig: IncentiveConfig | null;
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
  mode?: "page" | "template" | "widget" | "scheduling";
  saveEndpoint?: string;
  allowedSectionTypes?: SectionType[];
  backHref?: string;
  onTemplateLoad?: (data: { sections: PageSection[], designTheme: DesignTheme }) => void;
}

export function PageBuilder({ pageId, initialSections, initialTheme, initialIncentiveConfig, estimate, customer, brandKit, mode = "page", saveEndpoint, allowedSectionTypes, backHref, onTemplateLoad }: PageBuilderProps) {
  const {
    sections, designTheme, incentiveConfig, selectedSection, selectedSectionId, isSaving, isDirty,
    setSelectedSectionId, addSection, removeSection, updateSection, reorderSections, toggleVisibility,
    applyPreset, updateTheme, updateIncentiveConfig, addUniversalBlock, disconnectSection, save,
  } = usePageBuilder({ initialSections, initialTheme, initialIncentiveConfig, pageId, saveEndpoint });

  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [showBlockLibrary, setShowBlockLibrary] = useState(false);
  const [saveBlockSection, setSaveBlockSection] = useState<PageSection | null>(null);

  const handleSave = async () => {
    const result = await save();
    if (result.success) toast.success("Page saved");
    else toast.error(result.error || "Failed to save");
  };

  const handlePublish = async () => {
    const saveResult = await save();
    if (!saveResult.success) { toast.error("Save before publishing"); return; }
    try {
      const url = mode === "scheduling" ? `/api/scheduling/${pageId}/publish` : `/api/estimate-pages/${pageId}/publish`;
      const res = await fetch(url, { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast[res.status === 400 && body.error?.includes("draft") ? "success" : "error"](
          res.status === 400 && body.error?.includes("draft") ? "Page saved & updated" : body.error || "Failed to publish"
        );
        return;
      }
      toast.success("Page published");
    } catch { toast.error("Failed to publish"); }
  };

  const handleSaveAsBlock = async (data: { name: string; description?: string; category?: string }) => {
    if (!saveBlockSection) return;
    const res = await fetch("/api/universal-blocks", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, sectionType: saveBlockSection.type, settings: saveBlockSection.settings, content: saveBlockSection.content }),
    });
    const json = await res.json();
    if (!res.ok) { toast.error(json.error || "Failed to save block"); return; }
    updateSection(saveBlockSection.id, { universalBlockId: json.data.id, isConnected: true, universalBlockName: data.name });
    toast.success("Saved as universal block");
  };

  return (
    <div className="flex h-full flex-col">
      <BuilderTopBar mode={mode} isDirty={isDirty} isSaving={isSaving} pageId={pageId} backHref={backHref}
        onSave={handleSave} onPublish={handlePublish}
        onLoadTemplate={(mode === "widget" || mode === "scheduling") && onTemplateLoad ? () => setShowTemplatePicker(true) : undefined} />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 flex-shrink-0 border-r flex flex-col overflow-y-auto">
          <div className="p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Sections
          </div>
          <SectionList
            sections={sections}
            selectedSectionId={selectedSectionId}
            onSelect={setSelectedSectionId}
            onToggleVisibility={toggleVisibility}
            onRemove={removeSection}
            onReorder={reorderSections}
            onSaveAsBlock={(s) => setSaveBlockSection(s)}
          />
          <div className="p-2 border-t">
            <SectionPicker
              onAddSection={addSection}
              existingSections={sections.map((s) => s.type)}
              allowedTypes={allowedSectionTypes}
              onOpenLibrary={() => setShowBlockLibrary(true)}
            />
          </div>
        </div>

        <BuilderPreview sections={sections} selectedSectionId={selectedSectionId}
          setSelectedSectionId={setSelectedSectionId} previewMode={previewMode} setPreviewMode={setPreviewMode}
          designTheme={designTheme} brandKit={brandKit} estimate={estimate} customer={customer} pageId={pageId} />

        <div className="w-80 flex-shrink-0 border-l">
          <RightPanel
            selectedSection={selectedSection} designTheme={designTheme} incentiveConfig={incentiveConfig}
            primaryColor={brandKit?.primaryColor || "#2563eb"} secondaryColor={brandKit?.secondaryColor || "#1e40af"}
            onUpdateSection={updateSection} onUpdateTheme={updateTheme} onSelectPreset={applyPreset}
            onUpdateIncentiveConfig={updateIncentiveConfig} onCloseSection={() => setSelectedSectionId(null)}
            onDisconnectSection={disconnectSection}
          />
        </div>
      </div>

      {(mode === "widget" || mode === "scheduling") && onTemplateLoad && (
        <WidgetTemplatePicker open={showTemplatePicker} onClose={() => setShowTemplatePicker(false)} onTemplateSelected={onTemplateLoad} />
      )}
      <BlockLibraryDialog open={showBlockLibrary} onClose={() => setShowBlockLibrary(false)}
        onInsertConnected={(b: UniversalBlock) => addUniversalBlock(b, true)} onInsertCopy={(b: UniversalBlock) => addUniversalBlock(b, false)} />

      {saveBlockSection && (
        <SaveAsBlockDialog open onClose={() => setSaveBlockSection(null)}
          sectionType={saveBlockSection.type} onSave={handleSaveAsBlock} />
      )}
    </div>
  );
}
