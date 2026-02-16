'use client'

import { useState } from 'react'
import { Pencil, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import type { TimePair, UpdateTimeEntryInput } from '../types'

interface Props {
  pair: TimePair
  index: number
  canEdit: boolean
  onUpdate: (id: string, input: UpdateTimeEntryInput) => Promise<{ error?: string }>
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit',
  })
}

function formatDuration(minutes: number | null): string {
  if (minutes === null) return 'Running...'
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

const REASON_LABELS: Record<string, string> = {
  work: 'Work', break: 'Break', lunch: 'Lunch',
  travel: 'Travel', waiting: 'Waiting', other: 'Other',
}

export function TimeEntryRow({ pair, index, canEdit, onUpdate }: Props) {
  const [editing, setEditing] = useState(false)
  const [editReason, setEditReason] = useState('')
  const [editNotes, setEditNotes] = useState(pair.start.notes || '')

  const handleSave = async () => {
    if (!editReason.trim()) return
    const result = await onUpdate(pair.start.id, {
      notes: editNotes,
      editReason: editReason.trim(),
    })
    if (!result.error) setEditing(false)
  }

  const isEdited = !!pair.start.editedAt

  return (
    <tr className="border-b hover:bg-gray-50 text-sm">
      <td className="px-3 py-2 text-muted-foreground">{index + 1}</td>
      <td className="px-3 py-2">{formatTime(pair.start.recordedAt)}</td>
      <td className="px-3 py-2">{pair.stop ? formatTime(pair.stop.recordedAt) : '-'}</td>
      <td className="px-3 py-2 font-medium">{formatDuration(pair.duration)}</td>
      <td className="px-3 py-2">
        <Badge variant="outline" className="text-xs">{REASON_LABELS[pair.reason] || pair.reason}</Badge>
      </td>
      <td className="px-3 py-2">{pair.isBillable ? 'Yes' : 'No'}</td>
      <td className="px-3 py-2 max-w-[150px] truncate">
        {editing ? (
          <div className="space-y-1">
            <Input value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="Notes" className="h-7 text-xs" />
            <Input value={editReason} onChange={(e) => setEditReason(e.target.value)} placeholder="Reason for edit *" className="h-7 text-xs" />
          </div>
        ) : (
          <span className="text-muted-foreground">{pair.start.notes || '-'}</span>
        )}
      </td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-1">
          {editing ? (
            <>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleSave} disabled={!editReason.trim()}>
                <Check className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(false)}>
                <X className="h-3 w-3" />
              </Button>
            </>
          ) : canEdit ? (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(true)}>
              <Pencil className="h-3 w-3" />
            </Button>
          ) : null}
          {isEdited && <Badge variant="secondary" className="text-[10px] px-1">Edited</Badge>}
        </div>
      </td>
    </tr>
  )
}
