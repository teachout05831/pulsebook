"use client";

import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCustomerInvoices } from "../hooks/useCustomerInvoices";

function statusVariant(status: string) {
  if (status === "paid") return "default" as const;
  if (status === "overdue") return "destructive" as const;
  return "secondary" as const;
}

function formatCurrency(amount: number | null): string {
  if (amount === null || amount === undefined) return "$0.00";
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function InvoicesList() {
  const { invoices, isLoading, error } = useCustomerInvoices();

  if (isLoading) {
    return <div className="animate-pulse h-40 rounded bg-muted" />;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FileText className="h-10 w-10 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No invoices yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Invoices</h1>
      {/* Mobile card view */}
      <div className="space-y-3 md:hidden">
        {invoices.map((inv) => (
          <div key={inv.id} className="rounded-lg border bg-white p-3">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">
                {inv.invoiceNumber || "—"}
              </p>
              <Badge variant={statusVariant(inv.status)} className="text-xs">
                {inv.status.replace("_", " ")}
              </Badge>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-sm font-medium">{formatCurrency(inv.total)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Balance Due</p>
                <p className="text-sm font-medium">{formatCurrency(inv.balanceDue)}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Due: {formatDate(inv.dueDate)}
            </p>
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead>Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-medium">
                  {inv.invoiceNumber || "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(inv.status)}>
                    {inv.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(inv.total)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(inv.balanceDue)}
                </TableCell>
                <TableCell>{formatDate(inv.dueDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
