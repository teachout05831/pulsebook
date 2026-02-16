'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Payment } from '@/types';
import { PAYMENT_METHODS } from './InvoiceDetailHelpers';

interface RecordPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amountDue: number;
  paymentAmount: string;
  setPaymentAmount: (v: string) => void;
  paymentMethod: Payment['method'];
  setPaymentMethod: (m: Payment['method']) => void;
  paymentNotes: string;
  setPaymentNotes: (v: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function RecordPaymentDialog({
  open, onOpenChange, amountDue,
  paymentAmount, setPaymentAmount,
  paymentMethod, setPaymentMethod,
  paymentNotes, setPaymentNotes,
  onSubmit, isSubmitting,
}: RecordPaymentDialogProps) {
  const fmtCurrency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>Balance due: {fmtCurrency(amountDue)}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input type="number" step="0.01" min="0" max={amountDue} value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)} placeholder={amountDue.toFixed(2)} />
          </div>
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as Payment['method'])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <Textarea value={paymentNotes} onChange={(e) => setPaymentNotes(e.target.value)} placeholder="Check number, reference, etc." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Record Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
