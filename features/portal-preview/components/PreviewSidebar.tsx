"use client";

import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Receipt,
  FileCheck,
  Calendar,
  FolderOpen,
  User,
} from "lucide-react";
import type { CustomerProfileData } from "@/features/customer-portal/types";
import type { PreviewTab } from "../types";

interface Props {
  profile: CustomerProfileData | null;
  activeTab: PreviewTab;
  onTabChange: (tab: PreviewTab) => void;
}

const navItems: { tab: PreviewTab; label: string; icon: React.ElementType }[] = [
  { tab: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { tab: "estimates", label: "Estimates", icon: FileText },
  { tab: "jobs", label: "Jobs", icon: Briefcase },
  { tab: "invoices", label: "Invoices", icon: Receipt },
  { tab: "contracts", label: "Contracts", icon: FileCheck },
  { tab: "appointments", label: "Appointments", icon: Calendar },
  { tab: "documents", label: "Documents", icon: FolderOpen },
  { tab: "account", label: "Account", icon: User },
];

export function PreviewSidebar({ profile, activeTab, onTabChange }: Props) {
  return (
    <aside className="flex h-full w-64 flex-col border-r bg-white">
      <div className="border-b px-4 py-4">
        {profile?.companyLogo ? (
          <img
            src={profile.companyLogo}
            alt={profile.companyName}
            className="h-8 max-w-[160px] object-contain"
          />
        ) : (
          <span className="font-semibold text-sm">
            {profile?.companyName || "Customer Portal"}
          </span>
        )}
      </div>

      <nav className="flex-1 px-2 py-3 space-y-1">
        {navItems.map(({ tab, label, icon: Icon }) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>

      <div className="border-t px-4 py-3">
        <div className="text-xs text-muted-foreground truncate">
          {profile?.name || "Customer"}
        </div>
      </div>
    </aside>
  );
}
