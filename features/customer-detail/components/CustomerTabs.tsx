"use client";

import {
  LayoutDashboard,
  Target,
  ClipboardList,
  Wrench,
  DollarSign,
  Video,
  Folder,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomerTab, CustomerTabsProps } from "../types";

interface TabItem {
  id: CustomerTab;
  label: string;
  icon: React.ElementType;
  countKey?: keyof CustomerTabsProps["counts"];
  badgeVariant?: "success" | "warning" | "default";
}

const tabs: TabItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "sales", label: "Sales", icon: Target },
  { id: "estimates", label: "Estimates", icon: ClipboardList, countKey: "estimates", badgeVariant: "warning" },
  { id: "jobs", label: "Jobs", icon: Wrench, countKey: "jobs", badgeVariant: "success" },
  { id: "invoices", label: "Invoices", icon: DollarSign },
  { id: "consultations", label: "Consultations", icon: Video },
  { id: "files", label: "Files", icon: Folder },
  { id: "notes", label: "Notes", icon: FileText },
];

const badgeColors = {
  success: "bg-green-500 text-white",
  warning: "bg-amber-500 text-white",
  default: "bg-gray-500 text-white",
};

export function CustomerTabs({ activeTab, onTabChange, counts }: CustomerTabsProps) {
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
                <span
                  className={cn(
                    "ml-1 rounded-full px-1.5 md:px-2 py-0.5 text-xs font-semibold leading-none",
                    badgeColors[tab.badgeVariant || "default"]
                  )}
                >
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
