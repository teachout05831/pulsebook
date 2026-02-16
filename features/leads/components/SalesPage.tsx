"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Sparkles,
  User,
  Phone,
  Target,
  Search,
  Bell,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLeads } from "../hooks/useLeads";
import { AddLeadModal } from "./AddLeadModal";
import { LeadsDashboard } from "./LeadsDashboard";
import { NewLeadsTable } from "./NewLeadsTable";
import { MyLeadsView } from "./MyLeadsView";
import { FollowUpsView } from "./FollowUpsView";
import { SalesGoals } from "./SalesGoals";
import type { SalesTab } from "../types";

const tabs: Array<{
  id: SalesTab;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: number;
  badgeNeutral?: number;
}> = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "new-leads", label: "New Leads", icon: Sparkles },
  { id: "my-leads", label: "My Leads", icon: User },
  { id: "follow-up", label: "Follow-up", icon: Phone },
  { id: "sales-goals", label: "Sales Goals", icon: Target },
];

export function SalesPage() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as SalesTab) || "dashboard";

  const [activeTab, setActiveTab] = useState<SalesTab>(initialTab);
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch leads for badge counts
  const { total: newLeadsCount } = useLeads({ leadStatus: "new" });
  const { total: myLeadsCount } = useLeads({ leadStatusNot: "new" });

  // Update badge counts
  const tabsWithCounts = tabs.map((tab) => {
    if (tab.id === "new-leads") return { ...tab, badge: newLeadsCount };
    if (tab.id === "my-leads") return { ...tab, badgeNeutral: myLeadsCount };
    return tab;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Sales & Leads</h1>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              className="pl-9 w-full sm:w-72"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b overflow-x-auto">
        <nav className="flex min-w-max">
          {tabsWithCounts.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
                  {tab.badge}
                </span>
              )}
              {tab.badgeNeutral !== undefined && tab.badgeNeutral > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-600 rounded-full">
                  {tab.badgeNeutral}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px] md:min-h-[600px]">
        {activeTab === "dashboard" && <LeadsDashboard />}
        {activeTab === "new-leads" && (
          <NewLeadsTable
            searchQuery={searchQuery}
            onAddLead={() => setAddLeadOpen(true)}
          />
        )}
        {activeTab === "my-leads" && (
          <MyLeadsView
            searchQuery={searchQuery}
            onAddLead={() => setAddLeadOpen(true)}
          />
        )}
        {activeTab === "follow-up" && <FollowUpsView />}
        {activeTab === "sales-goals" && <SalesGoals />}
      </div>

      {/* Add Lead Modal */}
      <AddLeadModal open={addLeadOpen} onOpenChange={setAddLeadOpen} />
    </div>
  );
}
