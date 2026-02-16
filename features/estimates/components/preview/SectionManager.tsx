"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, ExternalLink, LayoutTemplate, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SECTION_LABELS } from "@/features/estimate-pages/types";
import { SectionPicker } from "@/features/estimate-pages/components/page-builder/SectionPicker";
import { toast } from "sonner";
import type { PageSection, SectionType } from "@/features/estimate-pages/types";

interface Props {
  sections: PageSection[];
  onToggle: (sectionId: string) => void;
  onAddSection: (type: SectionType) => void;
  onApplyTemplate: (templateId: string) => Promise<void>;
  pageId: string;
}

export function SectionManager({ sections, onToggle, onAddSection, onApplyTemplate, pageId }: Props) {
  const sorted = [...sections].sort((a, b) => a.order - b.order);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templates, setTemplates] = useState<{ id: string; name: string; description?: string; sections: unknown[] }[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (!showTemplates) return;
    setLoadingTemplates(true);
    fetch("/api/estimate-pages/templates")
      .then((r) => r.json())
      .then((json) => setTemplates(json.data || []))
      .catch(() => toast.error("Failed to load templates"))
      .finally(() => setLoadingTemplates(false));
  }, [showTemplates]);

  const handleApply = async (templateId: string) => {
    setApplying(true);
    try {
      await onApplyTemplate(templateId);
      toast.success("Template applied");
      setShowTemplates(false);
    } catch { toast.error("Failed to apply template"); }
    finally { setApplying(false); }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-900">Page Sections</h3>
        <a href={`/estimate-pages/${pageId}`} target="_blank" rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
          Full Builder <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="space-y-1 mb-3">
        {sorted.map((section) => (
          <button key={section.id} onClick={() => onToggle(section.id)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-50 transition-colors text-left">
            <span className={`text-sm ${section.visible ? "text-slate-700" : "text-slate-400"}`}>
              {section.customLabel || SECTION_LABELS[section.type as SectionType] || section.type}
            </span>
            {section.visible ? <Eye className="w-4 h-4 text-blue-500" /> : <EyeOff className="w-4 h-4 text-slate-300" />}
          </button>
        ))}
        {sorted.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-3">No sections yet. Add sections or apply a template.</p>
        )}
      </div>

      <div className="space-y-2">
        <SectionPicker onAddSection={onAddSection} existingSections={sections.map((s) => s.type)} />
        <button onClick={() => setShowTemplates(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors">
          <LayoutTemplate className="w-4 h-4" /> Apply Template
        </button>
      </div>

      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Apply a Template</DialogTitle></DialogHeader>
          {loadingTemplates && <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-slate-400" /></div>}
          {!loadingTemplates && templates.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-6">No templates saved yet. Create templates in the Page Builder.</p>
          )}
          {!loadingTemplates && templates.length > 0 && (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {templates.map((t) => (
                <button key={t.id} onClick={() => handleApply(t.id)} disabled={applying}
                  className="w-full text-left p-3 rounded-lg border hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <p className="text-sm font-medium">{t.name}</p>
                  {t.description && <p className="text-xs text-slate-500 mt-0.5">{t.description}</p>}
                  <p className="text-xs text-slate-400 mt-1">{t.sections.length} section{t.sections.length !== 1 ? "s" : ""}</p>
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
