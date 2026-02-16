"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LEADS_TABLE_COLUMNS } from "../../constants";
import { LeadsTableRow } from "./LeadsTableRow";
import { LeadCard } from "./LeadCard";
import type { Customer } from "@/types/customer";

interface LeadsTableProps {
  leads: Customer[];
  total: number;
  isLoading?: boolean;
  page?: number;
  onPageChange?: (page: number) => void;
  onScheduleFollowUp?: (lead: Customer) => void;
  visibleColumns: string[];
  from?: string;
}

export function LeadsTable({
  leads,
  total,
  isLoading,
  page = 1,
  onPageChange,
  onScheduleFollowUp,
  visibleColumns,
  from = "my-leads",
}: LeadsTableProps) {
  const router = useRouter();

  const handleRowClick = (lead: Customer) => {
    router.push(`/customers/${lead.id}?from=${from}`);
  };

  const activeColumns = LEADS_TABLE_COLUMNS.filter((col) => visibleColumns.includes(col.id));
  const colSpan = activeColumns.length + 1 + (onScheduleFollowUp ? 1 : 0);

  if (isLoading) {
    return (
      <Card className="p-8 text-center text-slate-500">Loading leads...</Card>
    );
  }

  return (
    <>
      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} onRowClick={handleRowClick} onScheduleFollowUp={onScheduleFollowUp} />
        ))}
        {leads.length === 0 && (
          <Card className="p-8 text-center text-slate-500">No leads found</Card>
        )}
      </div>

      {/* Desktop table view */}
      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="w-10 p-3">
                  <input type="checkbox" className="h-4 w-4 rounded" />
                </th>
                {activeColumns.map((col) => (
                  <th key={col.id} className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">
                    {col.id === "id" ? (
                      <button className="flex items-center gap-1"># <ChevronDown className="h-3 w-3" /></button>
                    ) : (
                      col.label
                    )}
                  </th>
                ))}
                {onScheduleFollowUp && (
                  <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <LeadsTableRow
                  key={lead.id}
                  lead={lead}
                  visibleColumns={visibleColumns}
                  onRowClick={handleRowClick}
                  onScheduleFollowUp={onScheduleFollowUp}
                />
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={colSpan} className="p-8 text-center text-slate-500">No leads found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 md:border-t">
        <span className="text-sm text-slate-500">
          Showing {leads.length} of {total}
        </span>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange?.(page - 1)}>
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">Previous</span>
          </Button>
          <Button variant="default" size="sm" className="min-w-8">{page}</Button>
          <Button variant="outline" size="sm" disabled={leads.length < 50} onClick={() => onPageChange?.(page + 1)}>
            <span className="hidden sm:inline mr-1">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
