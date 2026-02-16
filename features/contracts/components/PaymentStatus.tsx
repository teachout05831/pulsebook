'use client'

import { CheckCircle2, XCircle, Clock, RotateCcw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { PaymentStatus as PaymentStatusType } from '../types'

const STATUS_CONFIG: Record<PaymentStatusType, { icon: typeof CheckCircle2; label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { icon: Clock, label: 'Payment Pending', variant: 'secondary' },
  succeeded: { icon: CheckCircle2, label: 'Payment Successful', variant: 'default' },
  failed: { icon: XCircle, label: 'Payment Failed', variant: 'destructive' },
  refunded: { icon: RotateCcw, label: 'Refunded', variant: 'outline' },
}

interface Props {
  status: PaymentStatusType
  amount?: number
  collectedAt?: string | null
}

export function PaymentStatus({ status, amount, collectedAt }: Props) {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon

  return (
    <div className="flex items-center gap-3 rounded-lg border p-4">
      <Icon className="h-5 w-5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{config.label}</span>
          <Badge variant={config.variant}>{status}</Badge>
        </div>
        {amount != null && (
          <p className="text-sm text-muted-foreground mt-0.5">
            ${amount.toFixed(2)}
            {collectedAt && ` — collected ${new Date(collectedAt).toLocaleDateString()}`}
          </p>
        )}
      </div>
    </div>
  )
}
