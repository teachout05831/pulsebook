"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionContainerProps {
  icon: React.ReactNode;
  title: string;
  badge?: string;
  children: React.ReactNode;
}

export function SectionContainer({ icon, title, badge, children }: SectionContainerProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-4 py-3 border-b border-slate-100 text-left"
      >
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="text-xs text-slate-400">{badge}</span>
          )}
          <ChevronDown className={cn(
            "h-4 w-4 text-slate-400 transition-transform lg:hidden",
            isExpanded && "rotate-180"
          )} />
        </div>
      </button>
      <div className={cn("p-4", !isExpanded && "hidden lg:block")}>
        {children}
      </div>
    </div>
  );
}
