'use server';

import { createClient } from '@/lib/supabase/server';
import type { RecordPaymentInput } from '../types';

interface PaymentResult {
  success?: boolean;
  error?: string;
}

export async function recordPayment(input: RecordPaymentInput): Promise<PaymentResult> {
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // Validate inputs
  if (!input.invoiceId) return { error: 'Invoice ID is required' };
  if (!input.amount || input.amount <= 0) return { error: 'Valid amount is required' };
  if (!input.paymentMethod) return { error: 'Payment method is required' };
  if (!input.paymentDate) return { error: 'Payment date is required' };

  // Get current invoice
  const { data: invoice, error: fetchError } = await supabase
    .from('invoices')
    .select('id, amount_paid, amount_due, total, status')
    .eq('id', input.invoiceId)
    .single();

  if (fetchError || !invoice) {
    return { error: 'Invoice not found' };
  }

  // Calculate new amounts
  const newAmountPaid = (invoice.amount_paid || 0) + input.amount;
  const newAmountDue = invoice.total - newAmountPaid;
  const newStatus = newAmountDue <= 0 ? 'paid' : invoice.status;

  // Update invoice
  const { error: updateError } = await supabase
    .from('invoices')
    .update({
      amount_paid: newAmountPaid,
      amount_due: Math.max(0, newAmountDue),
      status: newStatus,
      payment_method: input.paymentMethod,
      payment_date: input.paymentDate,
      payment_reference: input.reference || null,
      payment_notes: input.notes || null,
    })
    .eq('id', input.invoiceId);

  if (updateError) {
    console.error('Error recording payment:', updateError);
    return { error: 'Failed to record payment' };
  }

  return { success: true };
}
