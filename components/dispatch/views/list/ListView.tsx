"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch } from "../../dispatch-provider";
import { JobDetailDialog } from "../../job-details/JobDetailDialog";
import type { DispatchJob } from "@/types/dispatch";
import { DynamicListJobRow } from "./DynamicListJobRow";
import { ColumnPicker } from "./ColumnPicker";
import { SavedViewsBar } from "./SavedViewsBar";
import { useListColumns, DEFAULT_COLUMN_IDS } from "./useListColumns";
import { useListViewSettings } from "./useListViewSettings";
import { sortJobsByColumn, exportJobsCSV } from "./list-helpers";
import type { SortOrder } from "./list-helpers";
import { cn } from "@/lib/utils";

export function ListView() {
  const { jobs, technicians, filters, selectedTechnicianIds, updateFilter, setSelectedTechnicianIds, setSelectedJobId, setIsDetailsPanelOpen, updateJob } = useDispatch();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortColumnId, setSortColumnId] = useState<string>("scheduledTime");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [activeColumnIds, setActiveColumnIds] = useState<string[]>(DEFAULT_COLUMN_IDS);

  const { views, activeView, switchView, saveView, deleteView, isLoading: viewsLoading } = useListViewSettings();
  const { visibleColumns, allColumns } = useListColumns({ activeColumnIds });

  const currentFilters = useMemo(() => ({
    statuses: filters.statuses, crewIds: filters.crewIds || [], technicianIds: selectedTechnicianIds,
  }), [filters.statuses, filters.crewIds, selectedTechnicianIds]);

  // Apply saved view when it changes (columns, sort, and filters)
  useEffect(() => {
    if (activeView) {
      setActiveColumnIds(activeView.columnIds);
      if (activeView.sortField) setSortColumnId(activeView.sortField);
      if (activeView.sortOrder) setSortOrder(activeView.sortOrder);
      if (activeView.filters) {
        updateFilter("statuses", (activeView.filters.statuses || []) as DispatchJob["status"][]);
        updateFilter("crewIds" as keyof typeof filters, activeView.filters.crewIds || [] as never);
        setSelectedTechnicianIds(activeView.filters.technicianIds || []);
      }
    }
  }, [activeView, updateFilter, setSelectedTechnicianIds]);

  const sortColumn = useMemo(() => visibleColumns.find((c) => c.id === sortColumnId) || null, [visibleColumns, sortColumnId]);
  const sortedJobs = useMemo(() => sortJobsByColumn(jobs, sortColumn, sortOrder), [jobs, sortColumn, sortOrder]);

  const handleSort = (colId: string) => {
    if (colId === sortColumnId) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortColumnId(colId); setSortOrder("asc"); }
  };

  const handleSelectAll = useCallback(() => {
    setSelectedIds((prev) => prev.size === jobs.length ? new Set() : new Set(jobs.map((j) => j.id)));
  }, [jobs]);

  const handleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }, []);

  const [dialogJob, setDialogJob] = useState<DispatchJob | null>(null);
  const lastClickRef = useRef<{ id: string; time: number }>({ id: "", time: 0 });

  const handleRowClick = useCallback((job: DispatchJob) => {
    const now = Date.now();
    if (lastClickRef.current.id === job.id && now - lastClickRef.current.time < 400) {
      setDialogJob(job);
      lastClickRef.current = { id: "", time: 0 };
      return;
    }
    lastClickRef.current = { id: job.id, time: now };
    setSelectedJobId(job.id);
    setIsDetailsPanelOpen(true);
  }, [setSelectedJobId, setIsDetailsPanelOpen]);

  const techMap = useMemo(() => new Map(technicians.map((t) => [t.id, t])), [technicians]);

  return (
    <div className="p-6 flex flex-col h-full">
      {/* Views + toolbar (single row) */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <SavedViewsBar
            views={views}
            activeViewId={activeView?.id || null}
            onSwitchView={switchView}
            onSaveView={saveView}
            onDeleteView={deleteView}
            currentColumnIds={activeColumnIds}
            currentSortField={sortColumnId}
            currentSortOrder={sortOrder}
            currentFilters={currentFilters}
          />
          {selectedIds.size > 0 && <span className="text-sm text-gray-500 ml-2">{selectedIds.size} selected</span>}
        </div>
        <div className="flex items-center gap-2">
          <ColumnPicker allColumns={allColumns} activeColumnIds={activeColumnIds} onColumnsChange={setActiveColumnIds} />
          <Button variant="outline" size="sm" onClick={() => exportJobsCSV(sortedJobs, visibleColumns)}>
            <Download className="h-4 w-4 mr-2" />Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-lg overflow-y-auto flex-1 min-h-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox checked={selectedIds.size === jobs.length && jobs.length > 0} onCheckedChange={handleSelectAll} />
              </TableHead>
              {visibleColumns.map((col) => (
                <TableHead key={col.id} className={cn(col.width, col.minWidth)}>
                  {col.sortable ? (
                    <Button variant="ghost" size="sm" className="-ml-3 h-8 hover:bg-transparent" onClick={() => handleSort(col.id)}>
                      {col.label}<ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <span className="text-xs font-medium">{col.label}</span>
                  )}
                </TableHead>
              ))}
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length + 2} className="text-center py-8 text-gray-500">No jobs found</TableCell>
              </TableRow>
            ) : (
              sortedJobs.map((job) => (
                <DynamicListJobRow
                  key={job.id} job={job} columns={visibleColumns}
                  technician={techMap.get(job.assignedTechnicianId ?? "") ?? null}
                  isSelected={selectedIds.has(job.id)} onSelect={() => handleSelect(job.id)}
                  onClick={() => handleRowClick(job)} onStatusChange={(status) => updateJob(job.id, { status })}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <JobDetailDialog job={dialogJob} open={!!dialogJob} onOpenChange={(o) => { if (!o) setDialogJob(null); }} />
    </div>
  );
}
