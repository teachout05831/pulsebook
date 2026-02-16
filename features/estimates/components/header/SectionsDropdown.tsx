"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ExternalLink, Plus, ChevronDown, LayoutGrid, GripVertical, Search, FileText, Image, Shield, CheckSquare, User, Truck, MapPin } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { SectionType } from "@/features/estimate-pages/types/core";

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
  onAddSection?: (type: SectionType) => void;
  onReorder?: (sectionId: string, direction: "up" | "down") => void;
}

const SECTION_CATALOG: { category: string; icon: typeof FileText; items: { type: SectionType; name: string; desc: string }[] }[] = [
  { category: "Content", icon: FileText, items: [
    { type: "hero", name: "Hero Banner", desc: "Full-width header with title & CTA" },
    { type: "about", name: "About Us", desc: "Company info and introduction" },
    { type: "scope", name: "Scope of Work", desc: "Detailed service breakdown" },
    { type: "pricing", name: "Pricing Table", desc: "Line items with totals" },
    { type: "notes", name: "Customer Notes", desc: "Notes visible to customer" },
    { type: "content_block", name: "Content Block", desc: "Rich text content area" },
    { type: "custom_html", name: "Custom HTML", desc: "Raw HTML section" },
  ]},
  { category: "Media", icon: Image, items: [
    { type: "gallery", name: "Photo Gallery", desc: "Image grid or carousel" },
    { type: "video", name: "Video", desc: "Embedded video player" },
    { type: "before_after", name: "Before / After", desc: "Comparison slider" },
    { type: "timeline", name: "Timeline", desc: "Step-by-step project timeline" },
  ]},
  { category: "Trust & Social Proof", icon: Shield, items: [
    { type: "testimonials", name: "Testimonials", desc: "Customer reviews and quotes" },
    { type: "trust_badges", name: "Trust Badges", desc: "Certifications and guarantees" },
    { type: "faq", name: "FAQ", desc: "Common questions and answers" },
  ]},
  { category: "Customer & Crew", icon: User, items: [
    { type: "customer_info", name: "Customer Info", desc: "Name, email, and phone" },
    { type: "crew_details", name: "Crew Details", desc: "Assigned team members" },
    { type: "addresses", name: "Addresses", desc: "Service locations" },
  ]},
  { category: "Forms & Actions", icon: CheckSquare, items: [
    { type: "approval", name: "Approval", desc: "Accept / decline with signature" },
    { type: "payment", name: "Payment", desc: "Collect deposit or full payment" },
    { type: "contact", name: "Contact Form", desc: "Customer inquiry form" },
    { type: "calendar", name: "Calendar Booking", desc: "Schedule appointment" },
    { type: "chat", name: "Live Chat", desc: "Real-time messaging widget" },
    { type: "video_call", name: "Video Call", desc: "Start a consultation call" },
  ]},
];

export function SectionsDropdown({ estimateId, sections, onToggle, onAddSection, onReorder }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"current" | "add">("current");
  const [search, setSearch] = useState("");

  const sortedSections = useMemo(() => [...sections].sort((a, b) => a.order - b.order), [sections]);
  const visibleCount = sections.filter((s) => s.visible).length;

  const filteredCatalog = useMemo(() => {
    if (!search) return SECTION_CATALOG;
    const q = search.toLowerCase();
    return SECTION_CATALOG.map((cat) => ({
      ...cat,
      items: cat.items.filter((i) => i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q) || i.type.includes(q)),
    })).filter((cat) => cat.items.length > 0);
  }, [search]);

  const handleAdd = (type: SectionType) => {
    if (onAddSection) {
      onAddSection(type);
      setTab("current");
      setSearch("");
    }
  };

  return (
    <Popover open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setTab("current"); setSearch(""); } }}>
      <PopoverTrigger asChild>
        <button className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-medium transition-all ${open ? "border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.08)] text-slate-700" : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50/50"}`}>
          <LayoutGrid className="w-3.5 h-3.5 text-slate-500" />
          Sections
          <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">{visibleCount}/{sections.length}</span>
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-[340px] p-0">
        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => { setTab("current"); setSearch(""); }}
            className={`flex-1 py-2 text-[11px] font-medium border-b-2 transition-colors ${tab === "current" ? "text-blue-600 border-blue-500" : "text-slate-400 border-transparent hover:text-slate-600"}`}
          >
            Current
          </button>
          <button
            onClick={() => setTab("add")}
            className={`flex-1 py-2 text-[11px] font-medium border-b-2 transition-colors ${tab === "add" ? "text-blue-600 border-blue-500" : "text-slate-400 border-transparent hover:text-slate-600"}`}
          >
            Add Section
          </button>
        </div>

        {/* Current sections */}
        {tab === "current" && (
          <>
            <div className="p-1.5 max-h-[280px] overflow-y-auto">
              {sortedSections.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic text-center py-4">No sections yet</p>
              ) : (
                sortedSections.map((section) => (
                  <div key={section.id} className="flex items-center gap-2 px-2.5 py-[6px] rounded-lg hover:bg-slate-50 group">
                    <GripVertical className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                    <span className={`flex-1 text-[11px] font-medium ${section.visible ? "text-slate-700" : "text-slate-400 line-through"}`}>
                      {section.title || section.type}
                    </span>
                    <button
                      onClick={() => onToggle(section.id, !section.visible)}
                      className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 flex-shrink-0 transition-colors"
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
            <div className="flex items-center justify-between px-3 py-2 border-t border-slate-100">
              <button
                onClick={() => { router.push(`/estimates/${estimateId}/page`); setOpen(false); }}
                className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-blue-600 transition-colors"
              >
                Open Full Builder
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
              <span className="text-[10px] text-slate-400">{sections.length} sections</span>
            </div>
          </>
        )}

        {/* Add section */}
        {tab === "add" && (
          <>
            <div className="px-3 py-2 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search sections..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/10 outline-none transition-all"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-1">
              {filteredCatalog.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No sections match &quot;{search}&quot;</p>
              ) : (
                filteredCatalog.map((cat) => (
                  <div key={cat.category}>
                    <div className="px-3 pt-2 pb-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      {cat.category}
                    </div>
                    {cat.items.map((item) => (
                      <button
                        key={item.type}
                        onClick={() => handleAdd(item.type)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors text-left group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-medium text-slate-700">{item.name}</div>
                          <div className="text-[10px] text-slate-400">{item.desc}</div>
                        </div>
                        <Plus className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 flex-shrink-0 transition-colors" />
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
