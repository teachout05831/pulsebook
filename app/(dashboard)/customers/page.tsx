"use client";

import { useState, useEffect, useCallback } from "react";
import { useList } from "@refinedev/core";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus, Search, X } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Customer } from "@/types";

// Helper to format date
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "-";
  }
};

// Loading skeleton for the table
function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
        </div>
      ))}
    </div>
  );
}

// Empty state component
function EmptyState({ isSearchActive }: { isSearchActive: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-muted p-4 mb-4">
        <svg
          className="h-8 w-8 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium">
        {isSearchActive ? "No customers found" : "No customers yet"}
      </h3>
      <p className="text-sm text-muted-foreground mt-1">
        {isSearchActive
          ? "Try adjusting your search terms."
          : "Get started by adding your first customer."}
      </p>
    </div>
  );
}

const PAGE_SIZE_OPTIONS = [10, 25, 50];
const DEBOUNCE_MS = 300;

export default function CustomersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get state from URL params
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const searchQuery = searchParams.get("q") || "";

  // Local state for search input (for debouncing)
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Build filters array for Refine
  const filters = searchQuery
    ? [{ field: "q", operator: "eq" as const, value: searchQuery }]
    : [];

  const { query, result } = useList<Customer>({
    resource: "customers",
    pagination: {
      currentPage,
      pageSize,
    },
    filters,
  });

  const { isLoading, isError } = query;
  const customers = result.data ?? [];
  const total = result.total ?? 0;

  // Calculate pagination info
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startItem = total > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, total);

  // Update URL with new params
  const updateParams = useCallback(
    (updates: { page?: number; pageSize?: number; q?: string }) => {
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

      router.push(`/customers?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchQuery) {
        // Reset to page 1 when searching
        updateParams({ q: searchInput, page: 1 });
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchInput, searchQuery, updateParams]);

  // Sync search input with URL when URL changes externally
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      updateParams({ page });
    }
  };

  const handlePageSizeChange = (newSize: string) => {
    const size = parseInt(newSize, 10);
    // Reset to page 1 when changing page size
    updateParams({ pageSize: size, page: 1 });
  };

  const clearSearch = () => {
    setSearchInput("");
    updateParams({ q: "", page: 1 });
  };

  const isSearchActive = searchQuery.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer database.
          </p>
        </div>
        <Button onClick={() => router.push("/customers/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg">
              All Customers {!isLoading && `(${total})`}
            </CardTitle>

            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 pr-9"
              />
              {isSearchActive && (
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
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton />
          ) : isError ? (
            <div className="text-center py-8 text-destructive">
              Failed to load customers. Please try again.
            </div>
          ) : customers.length === 0 ? (
            <EmptyState isSearchActive={isSearchActive} />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/customers/${customer.id}`)}
                    >
                      <TableCell className="font-medium">
                        {customer.name}
                      </TableCell>
                      <TableCell>{customer.email ?? "-"}</TableCell>
                      <TableCell>{customer.phone ?? "-"}</TableCell>
                      <TableCell>{formatDate(customer.createdAt)}</TableCell>
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
