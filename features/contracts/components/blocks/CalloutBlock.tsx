'use client'

import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import type { ContractBlock, BlockMode } from '../../types'

interface Props {
  block: ContractBlock
  mode: BlockMode
  onUpdate?: (content: Record<string, unknown>) => void
}

type CalloutVariant = 'info' | 'warning' | 'success' | 'error'

const VARIANT_CONFIG: Record<
  CalloutVariant,
  { bg: string; border: string; icon: React.ElementType }
> = {
  info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: Info },
  warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', icon: AlertTriangle },
  success: { bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle },
  error: { bg: 'bg-red-50', border: 'border-red-200', icon: XCircle },
}

export function CalloutBlock({ block, mode, onUpdate }: Props) {
  const text = (block.content.text as string) || ''
  const variant = (block.content.variant as CalloutVariant) || 'info'
  const config = VARIANT_CONFIG[variant]
  const Icon = config.icon

  if (mode === 'view') {
    return (
      <div className={`flex items-start gap-3 rounded border p-4 ${config.bg} ${config.border}`}>
        <Icon className="mt-0.5 h-5 w-5 shrink-0" />
        <p className="whitespace-pre-wrap text-sm">{text}</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Select
        value={variant}
        onValueChange={(val) =>
          onUpdate?.({ ...block.content, variant: val })
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="info">Info</SelectItem>
          <SelectItem value="warning">Warning</SelectItem>
          <SelectItem value="success">Success</SelectItem>
          <SelectItem value="error">Error</SelectItem>
        </SelectContent>
      </Select>
      <div className={`rounded border p-3 ${config.bg} ${config.border}`}>
        <div className="flex items-start gap-2">
          <Icon className="mt-1 h-4 w-4 shrink-0" />
          <Textarea
            value={text}
            placeholder="Callout text..."
            className="min-h-[60px] resize-none border-0 bg-transparent p-0 focus-visible:ring-0"
            onChange={(e) =>
              onUpdate?.({ ...block.content, text: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  )
}
