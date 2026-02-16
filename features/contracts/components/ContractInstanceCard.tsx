'use client'

import { Eye, Send, MoreHorizontal, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ContractInstance, ContractStatus } from '../types'

interface Props {
  instance: ContractInstance
  onView: (id: string) => void
  onStartLive: (id: string) => void
  onSend: (id: string) => void
  onUpdateStatus: (id: string, status: ContractStatus) => void
}

const STATUS_BADGES: Record<ContractStatus, { label: string; variant: string }> = {
  draft: { label: 'Draft', variant: 'bg-gray-100 text-gray-700' },
  sent: { label: 'Sent', variant: 'bg-blue-100 text-blue-700' },
  viewed: { label: 'Viewed', variant: 'bg-yellow-100 text-yellow-700' },
  signed: { label: 'Signed', variant: 'bg-green-100 text-green-700' },
  paid: { label: 'Paid', variant: 'bg-emerald-100 text-emerald-700' },
  completed: { label: 'Completed', variant: 'bg-purple-100 text-purple-700' },
  cancelled: { label: 'Cancelled', variant: 'bg-red-100 text-red-700' },
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function liveLabel(status: ContractStatus) {
  if (status === 'completed') return 'View'
  if (status === 'draft') return 'Start'
  return 'Resume'
}

export function ContractInstanceCard({ instance, onView, onStartLive, onSend, onUpdateStatus }: Props) {
  const badge = STATUS_BADGES[instance.status]
  const templateName = instance.templateSnapshot?.name || 'Contract'

  return (
    <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 border-b last:border-b-0">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate">{templateName}</p>
          <Badge className={`${badge.variant} text-xs`}>{badge.label}</Badge>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span>Created {formatDate(instance.createdAt)}</span>
          {instance.sentAt && <span>Sent {formatDate(instance.sentAt)}</span>}
          {instance.signedAt && <span>Signed {formatDate(instance.signedAt)}</span>}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0 ml-4">
        {instance.status !== 'cancelled' && (
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => onStartLive(instance.id)}>
            <Play className="h-3 w-3 mr-1" /> {liveLabel(instance.status)}
          </Button>
        )}
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView(instance.id)}>
          <Eye className="h-4 w-4" />
        </Button>
        {instance.status === 'draft' && (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onSend(instance.id)}>
            <Send className="h-4 w-4" />
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(instance.id)}>View Contract</DropdownMenuItem>
            {instance.status === 'draft' && (
              <DropdownMenuItem onClick={() => onSend(instance.id)}>Send to Customer</DropdownMenuItem>
            )}
            {instance.status !== 'cancelled' && instance.status !== 'completed' && (
              <DropdownMenuItem onClick={() => onUpdateStatus(instance.id, 'cancelled')}>
                Cancel Contract
              </DropdownMenuItem>
            )}
            {instance.status === 'signed' && (
              <DropdownMenuItem onClick={() => onUpdateStatus(instance.id, 'completed')}>
                Mark Completed
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
