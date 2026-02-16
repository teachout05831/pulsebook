"use client";

import { Loader2, Receipt, Wrench } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { InvoiceStatus } from "@/types";
import { INVOICE_STATUS_LABELS, INVOICE_STATUS_COLORS } from "@/types";
import type { InvoiceListItem } from "../types";
import { InvoicesPagination } from "./InvoicesPagination";
import { cn } from "@/lib/utils";

const fmtDate = (d: string | null | undefined) => {
  if (!d) return "-";
  try { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
  catch { return "-"; }
};
const fmtCurrency = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

interface InvoicesTableProps {
  invoices: InvoiceListItem[];
  isLoading: boolean;
  isError: boolean;
  isFiltered: boolean;
  visibleColumns: string[];
  navigatingTo: string | null;
  onNavigate: (id: string) => void;
  onNavigateJob: (jobId: string) => void;
  onNavigateCustomer: (customerId: string) => void;
  page: number; pageSize: number; total: number; totalPages: number;
  startItem: number; endItem: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: string) => void;
}

export function InvoicesTable({
  invoices, isLoading, isError, isFiltered, visibleColumns,
  navigatingTo, onNavigate, onNavigateJob, onNavigateCustomer,
  page, pageSize, total, totalPages, startItem, endItem,
  onPageChange, onPageSizeChange,
}: InvoicesTableProps) {
  const show = (id: string) => visibleColumns.includes(id);

  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead><TableHead>Customer</TableHead><TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead><TableHead className="text-right">Total</TableHead><TableHead className="text-right">Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              {[20, 32, 16, 24, 20, 20].map((w, j) => (
                <TableCell key={j} className={j >= 4 ? "text-right" : ""}><Skeleton className={`h-5 w-${w} ${j >= 4 ? "ml-auto" : ""}`} /></TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (isError) return <div className="text-center py-8 text-destructive">Failed to load invoices.</div>;

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-muted p-4 mb-4"><Receipt className="h-8 w-8 text-muted-foreground" /></div>
        <h3 className="text-lg font-medium">{isFiltered ? "No invoices found" : "No invoices yet"}</h3>
        <p className="text-sm text-muted-foreground mt-1">{isFiltered ? "Try adjusting your filters." : "Create your first invoice."}</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {show("invoiceNumber") && <TableHead>Invoice #</TableHead>}
            {show("customer") && <TableHead>Customer</TableHead>}
            {show("job") && <TableHead>Job</TableHead>}
            {show("status") && <TableHead>Status</TableHead>}
            {show("dueDate") && <TableHead>Due Date</TableHead>}
            {show("total") && <TableHead className="text-right">Total</TableHead>}
            {show("balance") && <TableHead className="text-right">Balance</TableHead>}
            {show("issueDate") && <TableHead>Issue Date</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv) => {
            const nav = navigatingTo === inv.id;
            return (
              <TableRow key={inv.id} className={cn("cursor-pointer hover:bg-muted/50", nav && "bg-muted/70 opacity-70")}
                onClick={() => onNavigate(inv.id)}>
                {show("invoiceNumber") && (
                  <TableCell className="font-medium flex items-center gap-2">
                    {nav && <Loader2 className="h-3 w-3 animate-spin" />}{inv.invoiceNumber}
                  </TableCell>
                )}
                {show("customer") && (
                  <TableCell>
                    <button className="text-blue-600 hover:underline text-sm"
                      onClick={(e) => { e.stopPropagation(); onNavigateCustomer(inv.customerId); }}>
                      {inv.customerName}
                    </button>
                  </TableCell>
                )}
                {show("job") && (
                  <TableCell>
                    {inv.jobTitle ? (
                      <button className="text-gray-600 hover:text-blue-600 hover:underline text-sm flex items-center gap-1.5"
                        onClick={(e) => { e.stopPropagation(); if (inv.jobId) onNavigateJob(inv.jobId); }}>
                        <Wrench className="h-3 w-3 text-muted-foreground" />{inv.jobTitle}
                      </button>
                    ) : <span className="text-muted-foreground">-</span>}
                  </TableCell>
                )}
                {show("status") && (
                  <TableCell>
                    <Badge variant="secondary" className={INVOICE_STATUS_COLORS[inv.status as InvoiceStatus]}>
                      {INVOICE_STATUS_LABELS[inv.status as InvoiceStatus]}
                    </Badge>
                  </TableCell>
                )}
                {show("dueDate") && (
                  <TableCell className={inv.status === "overdue" ? "text-red-600 font-medium" : "text-gray-600"}>{fmtDate(inv.dueDate)}</TableCell>
                )}
                {show("total") && <TableCell className="text-right font-medium">{fmtCurrency(inv.total)}</TableCell>}
                {show("balance") && (
                  <TableCell className="text-right font-medium">
                    {inv.amountDue > 0
                      ? <span className={inv.status === "overdue" ? "text-red-600" : ""}>{fmtCurrency(inv.amountDue)}</span>
                      : <span className="text-green-600">Paid</span>}
                  </TableCell>
                )}
                {show("issueDate") && <TableCell className="text-gray-600">{fmtDate(inv.issueDate)}</TableCell>}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <InvoicesPagination page={page} pageSize={pageSize} total={total} totalPages={totalPages}
        startItem={startItem} endItem={endItem} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />
    </>
  );
}
