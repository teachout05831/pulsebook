"use client";
import { Plus, Search, X, Calendar } from "lucide-react";
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
import { JOB_STATUS_LABELS, JOB_STATUS_COLORS } from "@/types";
import { useJobsList } from "../hooks/useJobsList";
import { useTerminology } from "@/components/providers/terminology-provider";

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" }, { value: "scheduled", label: "Scheduled" },
  { value: "in_progress", label: "In Progress" }, { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];
const formatDate = (d: string | null | undefined): string => {
  if (!d) return "-";
  try { return new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); }
  catch { return "-"; }
};
const formatTime = (t: string | null | undefined): string => {
  if (!t) return "";
  try {
    const [h, m] = t.split(":"); const hr = parseInt(h, 10);
    return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
  } catch { return t; }
};
function EmptyState({ isFiltered }: { isFiltered: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Calendar className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">{isFiltered ? "No jobs found" : "No jobs yet"}</h3>
      <p className="text-sm text-muted-foreground mt-1">
        {isFiltered ? "Try adjusting your filters or search terms." : "Get started by scheduling your first job."}
      </p>
    </div>
  );
}

export function JobsList() {
  const {
    jobs, isLoading, isError, total, searchInput, setSearchInput,
    isFiltered, statusFilter, currentPage, pageSize, totalPages,
    startItem, endItem, goToPage, handlePageSizeChange,
    handleStatusChange, clearSearch, router,
  } = useJobsList();
  const t = useTerminology();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t.job.plural}</h1>
          <p className="text-muted-foreground">Manage and schedule service {t.job.plural.toLowerCase()}.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/jobs/calendar")}>
            <Calendar className="mr-2 h-4 w-4" />Calendar
          </Button>
          <Button onClick={() => router.push("/jobs/new")}>
            <Plus className="mr-2 h-4 w-4" />New {t.job.singular}
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg">All {t.job.plural} {!isLoading && `(${total})`}</CardTitle>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder={`Search ${t.job.plural.toLowerCase()}...`} value={searchInput}
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
            <div className="text-center py-8 text-destructive">Failed to load jobs. Please try again.</div>
          ) : jobs.length === 0 ? <EmptyState isFiltered={isFiltered} /> : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job</TableHead><TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead><TableHead>Scheduled</TableHead>
                    <TableHead>Assigned To</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id} className="cursor-pointer" onClick={() => router.push(`/jobs/${job.id}`)}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{job.title}</div>
                          {job.address && <div className="text-sm text-muted-foreground truncate max-w-[200px]">{job.address}</div>}
                        </div>
                      </TableCell>
                      <TableCell>{job.customerName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={JOB_STATUS_COLORS[job.status]}>
                          {JOB_STATUS_LABELS[job.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{formatDate(job.scheduledDate)}</div>
                          {job.scheduledTime && <div className="text-sm text-muted-foreground">{formatTime(job.scheduledTime)}</div>}
                        </div>
                      </TableCell>
                      <TableCell>{job.assignedTo ?? "-"}</TableCell>
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
