"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useContractsList } from "../hooks/useContractsList";
import { useContractColumnPrefs } from "../hooks/useContractColumnPrefs";
import { ContractsStatsRow } from "./ContractsStatsRow";
import { ContractsFilters } from "./ContractsFilters";
import { ContractsTable } from "./ContractsTable";

export function ContractsList() {
  const {
    instances, stats, total, isLoading,
    search, setSearch, statusFilter, setStatusFilter,
    templateFilter, setTemplateFilter,
    dateFrom, setDateFrom, dateTo, setDateTo,
    page, pageSize, totalPages, goToPage,
  } = useContractsList();

  const { visibleColumns, toggleColumn, resetToDefault } = useContractColumnPrefs();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Contracts</h1>
          <p className="text-sm text-muted-foreground">Search, view, and download all contracts.</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>
      </div>

      <ContractsStatsRow stats={stats} isLoading={isLoading} />

      <Card>
        <ContractsFilters
          search={search} onSearchChange={setSearch}
          statusFilter={statusFilter} onStatusChange={setStatusFilter}
          templateFilter={templateFilter} onTemplateChange={setTemplateFilter}
          dateFrom={dateFrom} onDateFromChange={setDateFrom}
          dateTo={dateTo} onDateToChange={setDateTo}
          visibleColumns={visibleColumns}
          onToggleColumn={toggleColumn}
          onResetColumns={resetToDefault}
        />
        <ContractsTable
          instances={instances}
          isLoading={isLoading}
          visibleColumns={visibleColumns}
          page={page}
          pageSize={pageSize}
          total={total}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      </Card>
    </div>
  );
}
