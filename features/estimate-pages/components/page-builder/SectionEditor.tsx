"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { SECTION_LABELS } from "../../types";
import type { PageSection } from "../../types";
import { VARIANT_OPTIONS, PADDING_OPTIONS, getSetting } from "./sectionEditorConfig";
import { SectionEditorFields } from "./SectionEditorFields";
import { UniversalBlockBanner } from "@/features/universal-blocks/components/UniversalBlockBanner";

interface SectionEditorProps {
  section: PageSection | null;
  onUpdate: (id: string, updates: Partial<PageSection> | ((s: PageSection) => Partial<PageSection>)) => void;
  onClose: () => void;
  onDisconnect?: (sectionId: string) => void;
}

export function SectionEditor({ section, onUpdate, onClose, onDisconnect }: SectionEditorProps) {
  if (!section) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground p-6">
        Select a section to edit
      </div>
    );
  }

  const us = (key: string, value: unknown) =>
    onUpdate(section.id, (s) => ({ settings: { ...s.settings, [key]: value } }));
  const uc = (key: string, value: unknown) =>
    onUpdate(section.id, (s) => ({ content: { ...s.content, [key]: value } }));
  const ucBatch = (updates: Record<string, unknown>) =>
    onUpdate(section.id, (s) => ({ content: { ...s.content, ...updates } }));

  const variants = VARIANT_OPTIONS[section.type];

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-2">
        <Input
          className="h-7 text-sm font-semibold border-transparent px-1 focus-visible:border-input"
          placeholder={SECTION_LABELS[section.type]}
          value={section.customLabel || ""}
          onChange={(e) => onUpdate(section.id, { customLabel: e.target.value || undefined })}
        />
        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground shrink-0">
          Close
        </button>
      </div>

      {section.universalBlockId && section.isConnected && onDisconnect && (
        <UniversalBlockBanner
          blockName={section.universalBlockName || "Universal Block"}
          onDisconnect={() => onDisconnect(section.id)}
        />
      )}

      {variants && (
        <div className="space-y-1.5">
          <Label className="text-xs">Layout</Label>
          <Select value={getSetting(section, "variant", variants[0])} onValueChange={(v) => us("variant", v)}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {variants.map((v) => (
                <SelectItem key={v} value={v} className="text-xs capitalize">{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-1.5">
        <Label className="text-xs">Background</Label>
        <div className="flex gap-2">
          <input
            type="color"
            className="h-8 w-8 rounded border cursor-pointer"
            value={getSetting(section, "backgroundColor") || "#ffffff"}
            onChange={(e) => us("backgroundColor", e.target.value)}
          />
          <Input className="h-8 text-xs flex-1" placeholder="#ffffff"
            value={getSetting(section, "backgroundColor")} onChange={(e) => us("backgroundColor", e.target.value)} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Padding</Label>
        <Select value={getSetting(section, "padding", "normal")} onValueChange={(v) => us("padding", v)}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {PADDING_OPTIONS.map((p) => (
              <SelectItem key={p} value={p} className="text-xs capitalize">{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <hr className="border-border" />

      <SectionEditorFields section={section} onUpdateContent={uc} onUpdateSettings={us} onBatchUpdateContent={ucBatch} />
    </div>
  );
}
