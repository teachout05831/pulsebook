"use client";

import { useState } from "react";
import { Eye, EyeOff, ExternalLink, Plus, ChevronUp, ChevronDown, ChevronDownIcon, LayoutGrid, GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Section {
  id: string;
  type: string;
  visible: boolean;
  title?: string;
  order: number;
}

interface Props {
  estimateId: string;
  sections: Section[];
  onToggle: (sectionId: string, visible: boolean) => void;
  onAddSection?: (type: string) => void;
  onReorder?: (sectionId: string, direction: "up" | "down") => void;
}

const COMMON_SECTIONS = [
  { value: "hero", label: "Hero" },
  { value: "about", label: "About Us" },
  { value: "scope", label: "Scope of Work" },
  { value: "pricing", label: "Pricing" },
  { value: "customer_info", label: "Customer Info" },
  { value: "crew_details", label: "Crew Details" },
  { value: "addresses", label: "Addresses" },
  { value: "notes", label: "Customer Notes" },
  { value: "testimonials", label: "Testimonials" },
  { value: "gallery", label: "Gallery" },
  { value: "faq", label: "FAQ" },
  { value: "video", label: "Video" },
  { value: "approval", label: "Approval" },
];

export function CompactSections({ estimateId, sections, onToggle, onAddSection, onReorder }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  const visibleCount = sections.filter((s) => s.visible).length;

  const handleAddSection = (type: string) => {
    if (onAddSection) {
      onAddSection(type);
      setShowAddMenu(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center justify-between w-full px-3.5 py-2.5 bg-white border rounded-lg hover:border-slate-300 hover:bg-slate-50/50 transition-all text-[13px] font-medium text-slate-700">
          <span className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-slate-500" />
            Page Sections
            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {visibleCount} of {sections.length}
            </span>
          </span>
          <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" side="top" className="w-[340px] p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 py-2.5 border-b">
          <span className="text-xs font-semibold text-slate-600">Manage Sections</span>
          {onAddSection && (
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors"
            >
              <Plus className="w-3 h-3" />
              Add Section
            </button>
          )}
        </div>

        {/* Add Section Grid */}
        {showAddMenu && (
          <div className="px-3 py-2.5 border-b bg-slate-50/80">
            <div className="grid grid-cols-2 gap-0.5">
              {COMMON_SECTIONS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => handleAddSection(s.value)}
                  className="text-left text-[11px] text-slate-600 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-md transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section List */}
        <div className="px-1.5 py-1.5 max-h-[300px] overflow-y-auto">
          {sortedSections.length === 0 ? (
            <p className="text-[11px] text-slate-400 italic px-2 py-3 text-center">
              No sections yet. Add a section to get started.
            </p>
          ) : (
            sortedSections.map((section, index) => (
              <div
                key={section.id}
                className="flex items-center gap-2 px-2.5 py-[7px] rounded-lg hover:bg-slate-50 group"
              >
                {/* Drag handle */}
                <GripVertical className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />

                {/* Section name */}
                <span className={`flex-1 text-xs font-medium ${section.visible ? "text-slate-700" : "text-slate-400 line-through"}`}>
                  {section.title || section.type}
                </span>

                {/* Reorder buttons */}
                {onReorder && (
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onReorder(section.id, "up")}
                      disabled={index === 0}
                      className="w-[22px] h-[22px] flex items-center justify-center rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onReorder(section.id, "down")}
                      disabled={index === sortedSections.length - 1}
                      className="w-[22px] h-[22px] flex items-center justify-center rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Visibility toggle */}
                <button
                  onClick={() => onToggle(section.id, !section.visible)}
                  className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 flex-shrink-0 transition-colors"
                  title={section.visible ? "Hide section" : "Show section"}
                >
                  {section.visible ? (
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-slate-300" />
                  )}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3.5 py-2.5 border-t">
          <button
            onClick={() => { router.push(`/estimates/${estimateId}/page`); setOpen(false); }}
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-blue-600 transition-colors"
          >
            Open Full Builder
            <ExternalLink className="w-2.5 h-2.5" />
          </button>
          <span className="text-[11px] text-slate-400">{sections.length} sections</span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
