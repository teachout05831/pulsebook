"use client";

import { useState, useMemo } from "react";
import { FollowUpsSidebar } from "./filters/FollowUpsSidebar";
import { MobileFilterPills } from "./filters/MobileFilterPills";
import { FilterDropdowns } from "./filters/FilterDropdowns";
import { LeadsTable } from "./tables/LeadsTable";
import { ColumnPicker } from "./ColumnPicker";
import { CreateFollowUpModal } from "./CreateFollowUpModal";
import { useFollowUpLeads } from "../hooks/useFollowUpLeads";
import { useColumnPreferences } from "../hooks/useColumnPreferences";
import { FOLLOWUPS_SIDEBAR_FILTERS } from "../types";
import type { FollowUpsSidebarFilter } from "../types";
import type { Customer } from "@/types/customer";

export function FollowUpsView() {
  const [sidebarFilter, setSidebarFilter] = useState<FollowUpsSidebarFilter>("open");
  const [assignedTo, setAssignedTo] = useState<string>();
  const [localSearch, setLocalSearch] = useState("");
  const [page, setPage] = useState(1);
  const [followUpLead, setFollowUpLead] = useState<Customer | null>(null);
  const { visibleColumns, toggleColumn, resetToDefault } = useColumnPreferences();

  const { leads, total, isLoading } = useFollowUpLeads({
    filter: sidebarFilter,
    search: localSearch,
    assignedTo: assignedTo && assignedTo !== "all" ? assignedTo : undefined,
  });

  const effectiveColumns = useMemo(() => {
    if (visibleColumns.includes("followUpDate")) return visibleColumns;
    return [...visibleColumns, "followUpDate"];
  }, [visibleColumns]);

  const handleSidebarFilterChange = (filter: string) => {
    setSidebarFilter(filter as FollowUpsSidebarFilter);
    setPage(1);
  };

  return (
    <div className="flex flex-col md:flex-row md:h-[calc(100vh-180px)]">
      <MobileFilterPills
        filters={FOLLOWUPS_SIDEBAR_FILTERS}
        activeFilter={sidebarFilter}
        onFilterChange={handleSidebarFilterChange}
      />
      <FollowUpsSidebar
        activeFilter={sidebarFilter}
        onFilterChange={(f) => handleSidebarFilterChange(f)}
      />

      <div className="flex-1 p-4 overflow-auto space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <FilterDropdowns
            assignedTo={assignedTo}
            onAssignedToChange={(v) => { setAssignedTo(v); setPage(1); }}
            search={localSearch}
            onSearchChange={(v) => { setLocalSearch(v); setPage(1); }}
            showLeadStatus={false}
            showSource={false}
          />
          <ColumnPicker
            visibleColumns={effectiveColumns}
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
          visibleColumns={effectiveColumns}
          from="follow-ups"
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
