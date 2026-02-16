"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { Invoice } from "@/types/invoice";
import { INVOICE_STATUS_COLORS, INVOICE_STATUS_LABELS } from "@/types/invoice";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface InvoicesTableProps {
  invoices: Invoice[];
  onRecordPayment: (invoice: Invoice) => void;
}

export function InvoicesTable({ invoices, onRecordPayment }: InvoicesTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        {invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(invoice.issueDate)}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(invoice.dueDate)}</TableCell>
                    <TableCell className="font-semibold whitespace-nowrap">{formatCurrency(invoice.total)}</TableCell>
                    <TableCell>
                      <Badge className={INVOICE_STATUS_COLORS[invoice.status]}>{INVOICE_STATUS_LABELS[invoice.status]}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">View</Button>
                        {invoice.amountDue > 0 && (
                          <Button variant="ghost" size="sm" onClick={() => onRecordPayment(invoice)}>Pay</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">No invoices found</div>
        )}
      </CardContent>
    </Card>
  );
}
