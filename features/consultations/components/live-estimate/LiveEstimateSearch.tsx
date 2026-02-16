"use client";

import { useState, useMemo } from "react";
import { Search, Plus } from "lucide-react";

interface CatalogItem { id: string; name: string; defaultPrice?: number; unitPrice?: number; category: string }

interface Props {
  services: CatalogItem[];
  materials: CatalogItem[];
  onAdd: (item: CatalogItem, type: "service" | "material") => void;
  primaryColor: string;
}

export function LiveEstimateSearch({ services, materials, onAdd, primaryColor }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return { services: services.slice(0, 6), materials: materials.slice(0, 4) };
    return {
      services: services.filter(s => s.name.toLowerCase().includes(q)).slice(0, 6),
      materials: materials.filter(m => m.name.toLowerCase().includes(q)).slice(0, 4),
    };
  }, [query, services, materials]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search services & materials..."
          className="w-full bg-white/[0.05] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20"
        />
      </div>

      {filtered.services.length > 0 && (
        <div>
          <div className="text-[10px] uppercase tracking-wider text-white/30 mb-1.5">Services</div>
          <div className="flex flex-wrap gap-1.5">
            {filtered.services.map((s) => (
              <button
                key={s.id}
                onClick={() => onAdd(s, "service")}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-white/70 bg-white/[0.05] border border-white/10 hover:bg-white/10 transition-colors"
              >
                <Plus className="h-3 w-3" style={{ color: primaryColor }} />
                {s.name}
                <span className="text-white/30 ml-1">${s.defaultPrice ?? 0}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {filtered.materials.length > 0 && (
        <div>
          <div className="text-[10px] uppercase tracking-wider text-white/30 mb-1.5">Materials</div>
          <div className="flex flex-wrap gap-1.5">
            {filtered.materials.map((m) => (
              <button
                key={m.id}
                onClick={() => onAdd(m, "material")}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-white/70 bg-white/[0.05] border border-white/10 hover:bg-white/10 transition-colors"
              >
                <Plus className="h-3 w-3" style={{ color: primaryColor }} />
                {m.name}
                <span className="text-white/30 ml-1">${m.unitPrice ?? 0}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
