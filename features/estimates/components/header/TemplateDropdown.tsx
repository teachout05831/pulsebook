"use client";

import { useState, useMemo } from "react";
import { ChevronDown, LayoutTemplate, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface EstimateTemplate {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface Props {
  templates: EstimateTemplate[];
  activeTemplateId: string | null;
  onSwitch: (templateId: string) => void;
}

export function TemplateDropdown({ templates, activeTemplateId, onSwitch }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const active = templates.find((t) => t.id === activeTemplateId);

  const filtered = useMemo(() => {
    if (!search) return templates;
    const q = search.toLowerCase();
    return templates.filter((t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
  }, [templates, search]);

  return (
    <Popover open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSearch(""); }}>
      <PopoverTrigger asChild>
        <button className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-medium transition-all ${open ? "border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.08)] text-slate-700" : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50/50"}`}>
          <LayoutTemplate className="w-3.5 h-3.5 text-slate-500" />
          Template
          {active && <span className="text-[11px] text-slate-400 font-normal">{active.name}</span>}
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-[280px] p-0">
        {/* Search */}
        <div className="px-3 py-2 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/10 outline-none transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* Template list */}
        <div className="p-1 max-h-[300px] overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No templates match &quot;{search}&quot;</p>
          ) : (
            filtered.map((t) => (
              <button
                key={t.id}
                onClick={() => { onSwitch(t.id); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors text-left ${t.id === activeTemplateId ? "bg-blue-50" : "hover:bg-slate-50"}`}
              >
                <div
                  className="w-9 h-6 rounded border border-slate-200 flex-shrink-0"
                  style={{ background: t.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium text-slate-700">{t.name}</div>
                  <div className="text-[10px] text-slate-400">{t.description}</div>
                </div>
                {t.id === activeTemplateId && (
                  <span className="text-blue-600 text-sm font-bold flex-shrink-0">✓</span>
                )}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
