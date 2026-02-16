"use client";

import { Eye, EyeOff, ExternalLink } from "lucide-react";
import { SECTION_LABELS } from "@/features/estimate-pages/types";
import type { PageSection, SectionType } from "@/features/estimate-pages/types";

interface Props {
  sections: PageSection[];
  onToggle: (sectionId: string) => void;
  pageId: string;
}

export function SectionControls({ sections, onToggle, pageId }: Props) {
  const sorted = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-900">Page Sections</h3>
        <a
          href={`/estimate-pages/${pageId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          Open Page Builder <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      <div className="space-y-1">
        {sorted.map((section) => (
          <button
            key={section.id}
            onClick={() => onToggle(section.id)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-50 transition-colors text-left"
          >
            <span className={`text-sm ${section.visible ? "text-slate-700" : "text-slate-400"}`}>
              {section.customLabel || SECTION_LABELS[section.type as SectionType] || section.type}
            </span>
            {section.visible ? (
              <Eye className="w-4 h-4 text-blue-500" />
            ) : (
              <EyeOff className="w-4 h-4 text-slate-300" />
            )}
          </button>
        ))}
      </div>
      {sorted.length === 0 && (
        <p className="text-xs text-slate-400 text-center py-4">
          No sections configured yet. Open the Page Builder to add sections.
        </p>
      )}
    </div>
  );
}
