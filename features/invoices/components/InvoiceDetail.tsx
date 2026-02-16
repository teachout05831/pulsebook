'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useInvoiceDetail } from '../hooks/useInvoiceDetail';
import { DetailSkeleton } from './InvoiceDetailHelpers';
import { InvoiceDetailHeader } from './InvoiceDetailHeader';
import { InvoiceLineItems } from './InvoiceLineItems';
import { InvoiceDetailSidebar } from './InvoiceDetailSidebar';

interface InvoiceDetailProps {
  id: string;
}

export function InvoiceDetail({ id }: InvoiceDetailProps) {
  const {
    invoice,
    isLoading,
    isError,
    isUpdating,
    isDeleting,
    paymentDialogOpen,
    setPaymentDialogOpen,
    paymentAmount,
    setPaymentAmount,
    paymentMethod,
    setPaymentMethod,
    paymentNotes,
    setPaymentNotes,
    handleStatusChange,
    handleRecordPayment,
    handleMarkPaid,
    handleDelete,
    navigateBack,
    navigateToJob,
  } = useInvoiceDetail(id);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError || !invoice) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={navigateBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-destructive">
              Invoice not found or failed to load.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        <Link href="/invoices" className="text-blue-600 hover:underline">Invoices</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground font-medium">{invoice.invoiceNumber}</span>
      </div>

      <InvoiceDetailHeader
        invoice={invoice}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        paymentDialogOpen={paymentDialogOpen}
        setPaymentDialogOpen={setPaymentDialogOpen}
        paymentAmount={paymentAmount}
        setPaymentAmount={setPaymentAmount}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        paymentNotes={paymentNotes}
        setPaymentNotes={setPaymentNotes}
        onRecordPayment={handleRecordPayment}
        onMarkPaid={handleMarkPaid}
        onDelete={handleDelete}
        onBack={navigateBack}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <InvoiceLineItems invoice={invoice} />
        <InvoiceDetailSidebar
          invoice={invoice}
          isUpdating={isUpdating}
          onStatusChange={handleStatusChange}
          onNavigateToJob={navigateToJob}
        />
      </div>
    </div>
  );
}
