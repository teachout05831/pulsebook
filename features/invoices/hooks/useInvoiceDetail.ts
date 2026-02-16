'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Invoice, InvoiceStatus, Payment } from '@/types';
import { INVOICE_STATUS_LABELS } from '@/types';

export function useInvoiceDetail(id: string) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<Payment['method']>('card');
  const [paymentNotes, setPaymentNotes] = useState('');

  const fetchInvoice = useCallback(async () => {
    try {
      const res = await fetch(`/api/invoices/${id}`);
      if (!res.ok) throw new Error();
      const { data } = await res.json();
      setInvoice(data);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchInvoice(); }, [fetchInvoice]);

  const updateInvoice = async (values: Record<string, unknown>) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to update');
      }
      const { data } = await res.json();
      setInvoice(data);
      return data;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = async (newStatus: InvoiceStatus) => {
    if (!invoice) return;
    try {
      await updateInvoice({ status: newStatus });
      toast.success(`Status updated to ${INVOICE_STATUS_LABELS[newStatus]}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
    }
  };

  const handleRecordPayment = async () => {
    if (!invoice) return;
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }
    try {
      await updateInvoice({
        newPayment: { amount, method: paymentMethod, notes: paymentNotes || null },
      });
      toast.success('Payment recorded successfully');
      setPaymentDialogOpen(false);
      setPaymentAmount('');
      setPaymentNotes('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to record payment');
    }
  };

  const handleMarkPaid = async () => {
    if (!invoice) return;
    try {
      await updateInvoice({
        newPayment: { amount: invoice.amountDue, method: 'card', notes: 'Marked as paid in full' },
      });
      toast.success('Invoice marked as paid');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to mark as paid');
    }
  };

  const handleDelete = async () => {
    if (!invoice) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete invoice');
      toast.success('Invoice deleted successfully');
      router.push('/invoices');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete invoice');
      setIsDeleting(false);
    }
  };

  const navigateBack = () => router.push('/invoices');
  const navigateToJob = (jobId: string) => router.push(`/jobs/${jobId}`);

  return {
    invoice, isLoading, isError, isUpdating, isDeleting,
    paymentDialogOpen, setPaymentDialogOpen,
    paymentAmount, setPaymentAmount,
    paymentMethod, setPaymentMethod,
    paymentNotes, setPaymentNotes,
    handleStatusChange, handleRecordPayment, handleMarkPaid,
    handleDelete, navigateBack, navigateToJob,
  };
}
