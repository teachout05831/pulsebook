"use client";

import { Plus, Search, X } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { ListPagination } from "@/components/ui/list-pagination";
import { useCustomersList } from "../hooks/useCustomersList";
import { useTerminology } from "@/components/providers/terminology-provider";

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    });
  } catch { return "-"; }
};

function EmptyState({ isSearchActive }: { isSearchActive: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-muted p-4 mb-4">
        <svg className="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium">{isSearchActive ? "No customers found" : "No customers yet"}</h3>
      <p className="text-sm text-muted-foreground mt-1">
        {isSearchActive ? "Try adjusting your search terms." : "Get started by adding your first customer."}
      </p>
    </div>
  );
}

export function CustomersList() {
  const {
    customers, isLoading, isError, total, searchInput, setSearchInput,
    isSearchActive, currentPage, pageSize, totalPages, startItem, endItem,
    goToPage, handlePageSizeChange, clearSearch, router,
  } = useCustomersList();
  const t = useTerminology();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t.customer.plural}</h1>
          <p className="text-muted-foreground">Manage your {t.customer.singular.toLowerCase()} database.</p>
        </div>
        <Button onClick={() => router.push("/customers/new")}>
          <Plus className="mr-2 h-4 w-4" />Add {t.customer.singular}
        </Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg">All {t.customer.plural} {!isLoading && `(${total})`}</CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name, email, or phone..." value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)} className="pl-9 pr-9" />
              {isSearchActive && (
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={clearSearch}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? <TableSkeleton /> : isError ? (
            <div className="text-center py-8 text-destructive">Failed to load customers. Please try again.</div>
          ) : customers.length === 0 ? <EmptyState isSearchActive={isSearchActive} /> : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead><TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead><TableHead className="text-right">Balance</TableHead><TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id} className="cursor-pointer" onClick={() => router.push(`/customers/${customer.id}`)}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.email ?? "-"}</TableCell>
                      <TableCell>{customer.phone ?? "-"}</TableCell>
                      <TableCell className="text-right">
                        {customer.accountBalance ? (
                          <span className={customer.accountBalance > 0 ? "text-red-600 font-medium" : "text-green-600"}>
                            ${Math.abs(customer.accountBalance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">$0.00</span>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(customer.createdAt)}</TableCell>
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
