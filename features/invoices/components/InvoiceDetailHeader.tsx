'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Trash2, CreditCard, CheckCircle, Send, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { Invoice, Payment } from '@/types';
import { StatusBadge } from './InvoiceDetailHelpers';
import { RecordPaymentDialog } from './RecordPaymentDialog';

interface InvoiceDetailHeaderProps {
  invoice: Invoice;
  isUpdating: boolean;
  isDeleting: boolean;
  paymentDialogOpen: boolean;
  setPaymentDialogOpen: (open: boolean) => void;
  paymentAmount: string;
  setPaymentAmount: (value: string) => void;
  paymentMethod: Payment['method'];
  setPaymentMethod: (method: Payment['method']) => void;
  paymentNotes: string;
  setPaymentNotes: (value: string) => void;
  onRecordPayment: () => void;
  onMarkPaid: () => void;
  onDelete: () => void;
  onBack: () => void;
}

export function InvoiceDetailHeader({
  invoice, isUpdating, isDeleting,
  paymentDialogOpen, setPaymentDialogOpen,
  paymentAmount, setPaymentAmount,
  paymentMethod, setPaymentMethod,
  paymentNotes, setPaymentNotes,
  onRecordPayment, onMarkPaid, onDelete, onBack,
}: InvoiceDetailHeaderProps) {
  const router = useRouter();
  const showPaymentActions = invoice.status !== 'paid' && invoice.status !== 'cancelled';

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />Back
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{invoice.invoiceNumber}</h1>
            <StatusBadge status={invoice.status} />
          </div>
          <p className="text-sm mt-1">
            <button className="text-blue-600 hover:underline font-medium"
              onClick={() => router.push(`/customers/${invoice.customerId}`)}>
              {invoice.customerName}
            </button>
            {invoice.address && (
              <><span className="text-muted-foreground mx-2">|</span><span className="text-muted-foreground">{invoice.address}</span></>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {showPaymentActions && (
          <>
            <Button onClick={() => setPaymentDialogOpen(true)}>
              <CreditCard className="mr-2 h-4 w-4" />Record Payment
            </Button>
            <Button variant="outline" onClick={onMarkPaid} disabled={isUpdating}>
              <CheckCircle className="mr-2 h-4 w-4" />Mark Paid
            </Button>
          </>
        )}
        <Button variant="outline" size="icon" title="Send"><Send className="h-4 w-4" /></Button>
        <Button variant="outline" size="icon" title="Download"><Download className="h-4 w-4" /></Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="icon" disabled={isDeleting} title="Delete">
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-red-500" />}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {invoice.invoiceNumber}? This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <RecordPaymentDialog
          open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}
          amountDue={invoice.amountDue}
          paymentAmount={paymentAmount} setPaymentAmount={setPaymentAmount}
          paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
          paymentNotes={paymentNotes} setPaymentNotes={setPaymentNotes}
          onSubmit={onRecordPayment} isSubmitting={isUpdating}
        />
      </div>
    </div>
  );
}
