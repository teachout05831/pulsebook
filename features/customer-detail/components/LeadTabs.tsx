"use client";

import { Activity, Target, ClipboardList, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LeadTab, LeadTabsProps } from "../types";

interface TabItem {
  id: LeadTab;
  label: string;
  icon: React.ElementType;
  countKey?: keyof LeadTabsProps["counts"];
}

const tabs: TabItem[] = [
  { id: "activity", label: "Activity", icon: Activity, countKey: "interactions" },
  { id: "sales", label: "Sales Info", icon: Target },
  { id: "estimates", label: "Estimates", icon: ClipboardList, countKey: "estimates" },
  { id: "notes", label: "Notes", icon: FileText, countKey: "notes" },
];

export function LeadTabs({ activeTab, onTabChange, counts }: LeadTabsProps) {
  return (
    <nav className="border-b bg-white px-4 md:px-6 lg:px-8">
      <div className="flex gap-0 overflow-x-auto scrollbar-hide -mb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const count = tab.countKey ? counts[tab.countKey] : 0;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-1.5 md:gap-2 border-b-2 px-3 md:px-4 py-3 text-sm font-medium transition-all whitespace-nowrap shrink-0",
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground hover:bg-gray-50"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{tab.label}</span>
              {count > 0 && (
                <span className={cn(
                  "ml-1 rounded-full px-1.5 md:px-2 py-0.5 text-xs font-semibold leading-none",
                  isActive ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-600"
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
