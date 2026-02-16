"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Invoice } from "@/types/invoice";
import { RecordPaymentModal } from "@/features/invoices";
import { InvoicesTable, InvoicesBalanceSummary, PaymentMethodsSection } from "./invoices";

interface InvoicesTabProps {
  invoices: Invoice[];
  customerId: string;
  onRefresh?: () => void;
}

type FilterStatus = "all" | "outstanding" | "paid" | "overdue";

export function InvoicesTab({ invoices, customerId, onRefresh }: InvoicesTabProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const paidInvoices = invoices.filter((i) => i.status === "paid");
  const outstandingInvoices = invoices.filter((i) => i.status !== "paid" && i.status !== "cancelled" && i.amountDue > 0);
  const overdueInvoices = invoices.filter((i) => i.status === "overdue");

  const filteredInvoices = filter === "all" ? invoices
    : filter === "outstanding" ? outstandingInvoices
    : filter === "paid" ? paidInvoices
    : overdueInvoices;

  const totalInvoiced = invoices.reduce((sum, i) => sum + i.total, 0);
  const totalPaid = invoices.reduce((sum, i) => sum + i.amountPaid, 0);
  const balanceDue = invoices.reduce((sum, i) => sum + i.amountDue, 0);

  const handleRecordPayment = (invoice?: Invoice) => {
    setSelectedInvoice(invoice || outstandingInvoices[0] || null);
    setPaymentModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Invoices & Payments</h2>
          <p className="text-sm text-muted-foreground">{invoices.length} invoices</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-initial" onClick={() => handleRecordPayment()} disabled={outstandingInvoices.length === 0}>
            Record Payment
          </Button>
          <Button className="flex-1 sm:flex-initial" onClick={() => router.push(`/invoices/new?customerId=${customerId}`)}>
            + Create Invoice
          </Button>
        </div>
      </div>

      <InvoicesBalanceSummary
        balanceDue={balanceDue}
        totalInvoiced={totalInvoiced}
        totalPaid={totalPaid}
        invoiceCount={invoices.length}
        paidCount={paidInvoices.length}
      />

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {(["all", "paid", "outstanding", "overdue"] as const).map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" className="shrink-0" onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)} (
            {f === "all" ? invoices.length : f === "paid" ? paidInvoices.length : f === "outstanding" ? outstandingInvoices.length : overdueInvoices.length}
            )
          </Button>
        ))}
      </div>

      <InvoicesTable invoices={filteredInvoices} onRecordPayment={handleRecordPayment} />
      <PaymentMethodsSection />

      <RecordPaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        invoice={selectedInvoice}
        onSuccess={onRefresh}
      />
    </div>
  );
}
