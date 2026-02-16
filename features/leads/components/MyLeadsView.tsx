"use client";

import { useState } from "react";
import { LeadsSidebar } from "./filters/LeadsSidebar";
import { MobileFilterPills } from "./filters/MobileFilterPills";
import { FilterDropdowns } from "./filters/FilterDropdowns";
import { LeadsTable } from "./tables/LeadsTable";
import { ColumnPicker } from "./ColumnPicker";
import { CreateFollowUpModal } from "./CreateFollowUpModal";
import { useLeads } from "../hooks/useLeads";
import { useColumnPreferences } from "../hooks/useColumnPreferences";
import { LEADS_SIDEBAR_FILTERS } from "../types";
import type { LeadsSidebarFilter } from "../types";
import type { Customer } from "@/types/customer";

interface MyLeadsViewProps {
  searchQuery?: string;
  onAddLead?: () => void;
}

export function MyLeadsView({ searchQuery, onAddLead }: MyLeadsViewProps) {
  const [sidebarFilter, setSidebarFilter] = useState<LeadsSidebarFilter>("active");
  const [assignedTo, setAssignedTo] = useState<string>();
  const [leadStatus, setLeadStatus] = useState<string>();
  const [source, setSource] = useState<string>();
  const [localSearch, setLocalSearch] = useState(searchQuery || "");
  const [page, setPage] = useState(1);
  const [followUpLead, setFollowUpLead] = useState<Customer | null>(null);
  const { visibleColumns, toggleColumn, resetToDefault } = useColumnPreferences();

  const { leads, total, isLoading } = useLeads({
    leadStatusNot: sidebarFilter === "active" ? "new" : undefined,
    leadStatus: leadStatus && leadStatus !== "all" ? leadStatus : undefined,
    search: localSearch || searchQuery,
    sidebarFilter,
    assignedTo: assignedTo && assignedTo !== "all" ? assignedTo : undefined,
    source: source && source !== "all" ? source : undefined,
  });

  const handleSidebarFilterChange = (filter: string) => {
    setSidebarFilter(filter as LeadsSidebarFilter);
    setPage(1);
  };

  return (
    <div className="flex flex-col md:flex-row md:h-[600px]">
      <MobileFilterPills
        filters={LEADS_SIDEBAR_FILTERS}
        activeFilter={sidebarFilter}
        onFilterChange={handleSidebarFilterChange}
      />
      <LeadsSidebar
        activeFilter={sidebarFilter}
        onFilterChange={(f) => handleSidebarFilterChange(f)}
      />

      <div className="flex-1 p-4 space-y-4 bg-slate-50 overflow-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <FilterDropdowns
            assignedTo={assignedTo}
            onAssignedToChange={(v) => { setAssignedTo(v); setPage(1); }}
            leadStatus={leadStatus}
            onLeadStatusChange={(v) => { setLeadStatus(v); setPage(1); }}
            source={source}
            onSourceChange={(v) => { setSource(v); setPage(1); }}
            search={localSearch}
            onSearchChange={(v) => { setLocalSearch(v); setPage(1); }}
            showLeadStatus={true}
            showSource={true}
          />
          <ColumnPicker
            visibleColumns={visibleColumns}
            onToggle={toggleColumn}
            onReset={resetToDefault}
          />
        </div>

        <LeadsTable
          leads={leads}
          total={total}
          isLoading={isLoading}
          page={page}
          onPageChange={setPage}
          onScheduleFollowUp={setFollowUpLead}
          visibleColumns={visibleColumns}
        />
      </div>

      {followUpLead && (
        <CreateFollowUpModal
          open={!!followUpLead}
          onOpenChange={(open) => !open && setFollowUpLead(null)}
          leadId={followUpLead.id}
          leadName={followUpLead.name}
        />
      )}
    </div>
  );
}
