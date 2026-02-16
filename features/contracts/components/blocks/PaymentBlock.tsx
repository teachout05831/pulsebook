'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CreditCard } from 'lucide-react'
import type { ContractBlock, BlockMode } from '../../types'

interface Props {
  block: ContractBlock
  mode: BlockMode
  onUpdate?: (content: Record<string, unknown>) => void
}

type PaymentType = 'deposit' | 'full' | 'recurring'

const PAYMENT_LABELS: Record<PaymentType, string> = {
  deposit: 'Deposit',
  full: 'Full Payment',
  recurring: 'Recurring',
}

export function PaymentBlock({ block, mode, onUpdate }: Props) {
  const amount = (block.content.amount as number) ?? 0
  const paymentType = (block.content.paymentType as PaymentType) || 'full'
  const depositPercent = (block.content.depositPercent as number) ?? 50

  if (mode === 'view') {
    return (
      <div className="flex items-center gap-3 rounded border p-4">
        <CreditCard className="h-5 w-5 text-muted-foreground" />
        <div className="text-sm">
          <span className="font-semibold">${amount.toFixed(2)}</span>
          <span className="text-muted-foreground"> - {PAYMENT_LABELS[paymentType]}</span>
          {paymentType === 'deposit' && (
            <span className="text-muted-foreground"> ({depositPercent}%)</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 rounded border p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <CreditCard className="h-4 w-4" />
        <span>Payment</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Amount ($)</label>
          <Input
            type="number"
            min={0}
            step={0.01}
            value={amount}
            onChange={(e) =>
              onUpdate?.({ ...block.content, amount: Number(e.target.value) })
            }
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Type</label>
          <Select
            value={paymentType}
            onValueChange={(val) =>
              onUpdate?.({ ...block.content, paymentType: val })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deposit">Deposit</SelectItem>
              <SelectItem value="full">Full Payment</SelectItem>
              <SelectItem value="recurring">Recurring</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {paymentType === 'deposit' && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Deposit %
            </label>
            <Input
              type="number"
              min={1}
              max={100}
              value={depositPercent}
              onChange={(e) =>
                onUpdate?.({ ...block.content, depositPercent: Number(e.target.value) })
              }
            />
          </div>
        )}
      </div>
    </div>
  )
}
