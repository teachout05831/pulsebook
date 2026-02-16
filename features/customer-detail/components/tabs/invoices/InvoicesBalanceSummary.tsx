"use client";

import { Card, CardContent } from "@/components/ui/card";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

interface InvoicesBalanceSummaryProps {
  balanceDue: number;
  totalInvoiced: number;
  totalPaid: number;
  invoiceCount: number;
  paidCount: number;
}

export function InvoicesBalanceSummary({ balanceDue, totalInvoiced, totalPaid, invoiceCount, paidCount }: InvoicesBalanceSummaryProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-4">
          <div className="text-sm text-muted-foreground">Current Balance</div>
          <div className={`text-2xl font-bold ${balanceDue > 0 ? "text-red-600" : "text-green-600"}`}>
            {formatCurrency(balanceDue)}
          </div>
          <div className="text-xs text-muted-foreground">{balanceDue === 0 ? "All paid" : "outstanding"}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="text-sm text-muted-foreground">Total Invoiced</div>
          <div className="text-2xl font-bold">{formatCurrency(totalInvoiced)}</div>
          <div className="text-xs text-muted-foreground">{invoiceCount} invoices</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="text-sm text-muted-foreground">Total Paid</div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
          <div className="text-xs text-muted-foreground">{paidCount} payments</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="text-sm text-muted-foreground">Avg Payment Time</div>
          <div className="text-2xl font-bold">3 days</div>
          <div className="text-xs text-muted-foreground">Excellent payer</div>
        </CardContent>
      </Card>
    </div>
  );
}
