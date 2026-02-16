"use client";

import { Plus, Search, X, FileText } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { ListPagination } from "@/components/ui/list-pagination";
import { ESTIMATE_STATUS_LABELS, ESTIMATE_STATUS_COLORS } from "@/types";
import { useEstimatesList } from "../hooks/useEstimatesList";
import { useTerminology } from "@/components/providers/terminology-provider";

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" }, { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" }, { value: "approved", label: "Approved" },
  { value: "declined", label: "Declined" }, { value: "expired", label: "Expired" },
];

const PAGE_BADGE: Record<string, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-gray-100 text-gray-700" },
  published: { label: "Live", className: "bg-green-100 text-green-700" },
  viewed: { label: "Viewed", className: "bg-blue-100 text-blue-700" },
  approved: { label: "Approved", className: "bg-green-100 text-green-700" },
  declined: { label: "Declined", className: "bg-red-100 text-red-700" },
};

const formatDate = (d: string | null | undefined): string => {
  if (!d) return "-";
  try { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
  catch { return "-"; }
};

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

function EmptyState({ isFiltered }: { isFiltered: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-muted p-4 mb-4">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">{isFiltered ? "No estimates found" : "No estimates yet"}</h3>
      <p className="text-sm text-muted-foreground mt-1">
        {isFiltered ? "Try adjusting your filters or search terms." : "Get started by creating your first estimate."}
      </p>
    </div>
  );
}

export function EstimatesList() {
  const {
    estimates, isLoading, isError, total, searchInput, setSearchInput,
    isFiltered, statusFilter, currentPage, pageSize, totalPages,
    startItem, endItem, goToPage, handlePageSizeChange,
    handleStatusChange, clearSearch, router,
  } = useEstimatesList();
  const t = useTerminology();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t.estimate.plural}</h1>
          <p className="text-muted-foreground">Create and manage {t.customer.singular.toLowerCase()} {t.estimate.plural.toLowerCase()}.</p>
        </div>
        <Button onClick={() => router.push("/estimates/new")}>
          <Plus className="mr-2 h-4 w-4" />New {t.estimate.singular}
        </Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg">All {t.estimate.plural} {!isLoading && `(${total})`}</CardTitle>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder={`Search ${t.estimate.plural.toLowerCase()}...`} value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)} className="pl-9 pr-9" />
                {searchInput && (
                  <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={clearSearch}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? <TableSkeleton /> : isError ? (
            <div className="text-center py-8 text-destructive">Failed to load estimates. Please try again.</div>
          ) : estimates.length === 0 ? <EmptyState isFiltered={isFiltered} /> : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estimate #</TableHead><TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead><TableHead>Page</TableHead>
                    <TableHead>Issue Date</TableHead><TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estimates.map((est) => (
                    <TableRow key={est.id} className="cursor-pointer" onClick={() => router.push(`/estimates/${est.id}`)}>
                      <TableCell><span className="font-medium">{est.estimateNumber}</span></TableCell>
                      <TableCell>{est.customerName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={ESTIMATE_STATUS_COLORS[est.status]}>
                          {ESTIMATE_STATUS_LABELS[est.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {est.pageStatus ? (
                          <Badge variant="outline" className={PAGE_BADGE[est.pageStatus]?.className || "bg-gray-100 text-gray-700"}>
                            {PAGE_BADGE[est.pageStatus]?.label || est.pageStatus}
                          </Badge>
                        ) : <span className="text-muted-foreground">&mdash;</span>}
                      </TableCell>
                      <TableCell>{formatDate(est.issueDate)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(est.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ListPagination currentPage={currentPage} totalPages={totalPages} pageSize={pageSize}
                startItem={startItem} endItem={endItem} total={total}
                onPageChange={goToPage} onPageSizeChange={handlePageSizeChange} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
