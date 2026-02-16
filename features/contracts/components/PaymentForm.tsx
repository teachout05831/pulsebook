'use client'

import { useState } from 'react'
import { CreditCard, DollarSign, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import type { PaymentMethod, PaymentType } from '../types'

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'check', label: 'Check' },
  { value: 'card', label: 'Card' },
  { value: 'ach', label: 'ACH / Bank Transfer' },
  { value: 'venmo', label: 'Venmo' },
  { value: 'zelle', label: 'Zelle' },
  { value: 'other', label: 'Other' },
]

const PAYMENT_TYPES: { value: PaymentType; label: string }[] = [
  { value: 'full', label: 'Full Payment' },
  { value: 'deposit', label: 'Deposit' },
  { value: 'milestone', label: 'Milestone' },
  { value: 'recurring', label: 'Recurring' },
]

interface Props {
  defaultAmount?: number
  onSubmit: (data: {
    amount: number; paymentType: PaymentType; paymentMethod: PaymentMethod
  }) => Promise<{ error?: string }>
}

export function PaymentForm({ defaultAmount = 0, onSubmit }: Props) {
  const [amount, setAmount] = useState(defaultAmount)
  const [paymentType, setPaymentType] = useState<PaymentType>('full')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (amount <= 0) { setError('Amount must be greater than 0'); return }
    setIsSubmitting(true)
    setError(null)
    const result = await onSubmit({ amount, paymentType, paymentMethod })
    if (result.error) setError(result.error)
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <DollarSign className="h-4 w-4" />
        <span>Record Payment</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Amount ($)</label>
          <Input type="number" min={0} step={0.01} value={amount}
            onChange={(e) => setAmount(Number(e.target.value))} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Type</label>
          <Select value={paymentType} onValueChange={(v) => setPaymentType(v as PaymentType)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PAYMENT_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Method</label>
          <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PAYMENT_METHODS.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Processing...</>
          ) : (
            <><CreditCard className="h-4 w-4 mr-2" />Record Payment</>
          )}
        </Button>
      </div>
    </form>
  )
}
