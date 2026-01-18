"use client";

import { useState, useEffect, useCallback } from "react";
import { useList } from "@refinedev/core";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus, Search, X, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Job, JobStatus } from "@/types";
import { JOB_STATUS_LABELS, JOB_STATUS_COLORS } from "@/types";

// Status badge component
function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <Badge variant="secondary" className={JOB_STATUS_COLORS[status]}>
      {JOB_STATUS_LABELS[status]}
    </Badge>
  );
}

// Helper to format date
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "-";
  }
};

// Format time
const formatTime = (timeString: string | null | undefined): string => {
  if (!timeString) return "";
  try {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  } catch {
    return timeString;
  }
};

// Loading skeleton
function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      ))}
    </div>
  );
}

// Empty state
function EmptyState({ isFiltered }: { isFiltered: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Calendar className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">
        {isFiltered ? "No jobs found" : "No jobs yet"}
      </h3>
      <p className="text-sm text-muted-foreground mt-1">
        {isFiltered
          ? "Try adjusting your filters or search terms."
          : "Get started by scheduling your first job."}
      </p>
    </div>
  );
}

const PAGE_SIZE_OPTIONS = [10, 25, 50];
const DEBOUNCE_MS = 300;

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "scheduled", label: "Scheduled" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get state from URL params
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const searchQuery = searchParams.get("q") || "";
  const statusFilter = searchParams.get("status") || "all";

  // Local state for search input (for debouncing)
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Build filters array for Refine
  const filters = [];
  if (searchQuery) {
    filters.push({ field: "q", operator: "eq" as const, value: searchQuery });
  }
  if (statusFilter && statusFilter !== "all") {
    filters.push({ field: "status", operator: "eq" as const, value: statusFilter });
  }

  const { query, result } = useList<Job>({
    resource: "jobs",
    pagination: {
      currentPage,
      pageSize,
    },
    filters,
  });

  const { isLoading, isError } = query;
  const jobs = result.data ?? [];
  const total = result.total ?? 0;

  // Calculate pagination info
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startItem = total > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, total);

  // Update URL with new params
  const updateParams = useCallback(
    (updates: { page?: number; pageSize?: number; q?: string; status?: string }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (updates.page !== undefined) {
        params.set("page", String(updates.page));
      }
      if (updates.pageSize !== undefined) {
        params.set("pageSize", String(updates.pageSize));
      }
      if (updates.q !== undefined) {
        if (updates.q) {
          params.set("q", updates.q);
        } else {
          params.delete("q");
        }
      }
      if (updates.status !== undefined) {
        if (updates.status && updates.status !== "all") {
          params.set("status", updates.status);
        } else {
          params.delete("status");
        }
      }

      router.push(`/jobs?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchQuery) {
        updateParams({ q: searchInput, page: 1 });
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchInput, searchQuery, updateParams]);

  // Sync search input with URL
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      updateParams({ page });
    }
  };

  const handlePageSizeChange = (newSize: string) => {
    updateParams({ pageSize: parseInt(newSize, 10), page: 1 });
  };

  const handleStatusChange = (newStatus: string) => {
    updateParams({ status: newStatus, page: 1 });
  };

  const clearSearch = () => {
    setSearchInput("");
    updateParams({ q: "", page: 1 });
  };

  const isFiltered = searchQuery.length > 0 || (statusFilter !== "all");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Jobs</h1>
          <p className="text-muted-foreground">
            Manage and schedule service jobs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/jobs/calendar")}>
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </Button>
          <Button onClick={() => router.push("/jobs/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Job
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg">
                All Jobs {!isLoading && `(${total})`}
              </CardTitle>

              {/* Search Input */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-9 pr-9"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={clearSearch}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton />
          ) : isError ? (
            <div className="text-center py-8 text-destructive">
              Failed to load jobs. Please try again.
            </div>
          ) : jobs.length === 0 ? (
            <EmptyState isFiltered={isFiltered} />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Assigned To</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow
                      key={job.id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/jobs/${job.id}`)}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{job.title}</div>
                          {job.address && (
                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {job.address}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{job.customerName}</TableCell>
                      <TableCell>
                        <StatusBadge status={job.status} />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{formatDate(job.scheduledDate)}</div>
                          {job.scheduledTime && (
                            <div className="text-sm text-muted-foreground">
                              {formatTime(job.scheduledTime)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{job.assignedTo ?? "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>
                    Showing {startItem}-{endItem} of {total}
                  </span>
                  <span className="mx-2">|</span>
                  <span>Rows per page:</span>
                  <Select
                    value={String(pageSize)}
                    onValueChange={handlePageSizeChange}
                  >
                    <SelectTrigger className="w-[70px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGE_SIZE_OPTIONS.map((size) => (
                        <SelectItem key={size} value={String(size)}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
