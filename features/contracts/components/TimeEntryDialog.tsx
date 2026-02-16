'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import type { TimeEventType, TimeReason, RecordTimeEntryInput, UpdateTimeEntryInput, TimeEntry } from '../types'

interface RecordProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contractId: string
  onRecord: (input: RecordTimeEntryInput) => Promise<{ error?: string }>
  editEntry?: TimeEntry
  onUpdate?: (id: string, input: UpdateTimeEntryInput) => Promise<{ error?: string }>
}

const REASONS: { value: TimeReason; label: string }[] = [
  { value: 'work', label: 'Work' }, { value: 'break', label: 'Break' },
  { value: 'lunch', label: 'Lunch' }, { value: 'travel', label: 'Travel' },
  { value: 'waiting', label: 'Waiting' }, { value: 'other', label: 'Other' },
]

function toTimeInput(iso: string) {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function TimeEntryDialog({ open, onOpenChange, contractId, onRecord, editEntry, onUpdate }: RecordProps) {
  const isEdit = !!editEntry
  const [eventType, setEventType] = useState<TimeEventType>(editEntry?.eventType || 'start')
  const [reason, setReason] = useState<TimeReason>((editEntry?.reason as TimeReason) || 'work')
  const [notes, setNotes] = useState(editEntry?.notes || '')
  const [editReason, setEditReason] = useState('')
  const [newTime, setNewTime] = useState(editEntry ? toTimeInput(editEntry.recordedAt) : '')
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async () => {
    setIsSaving(true)
    if (isEdit && onUpdate && editEntry) {
      if (!editReason.trim()) { setIsSaving(false); toast.error('Edit reason is required'); return }
      const result = await onUpdate(editEntry.id, {
        notes: notes.trim() || undefined,
        editReason: editReason.trim(),
        recordedAt: newTime ? rebuildTime(editEntry.recordedAt, newTime) : undefined,
      })
      setIsSaving(false)
      if (result.error) { toast.error(result.error) } else {
        toast.success('Time entry updated'); onOpenChange(false)
      }
    } else {
      const result = await onRecord({
        contractId, eventType, reason,
        isBillable: reason === 'work' || reason === 'travel',
        notes: notes.trim() || undefined,
      })
      setIsSaving(false)
      if (result.error) { toast.error(result.error) } else {
        toast.success(`${eventType === 'start' ? 'Started' : 'Stopped'} time entry`)
        setNotes(''); onOpenChange(false)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Time Entry' : 'Record Time Entry'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {isEdit && editEntry && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                Original: {new Date(editEntry.recordedAt).toLocaleString()}
                {editEntry.editedAt && (
                  <span className="ml-2 text-yellow-600">
                    (Edited {new Date(editEntry.editedAt).toLocaleString()})
                  </span>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>New Time</Label>
                <Input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Reason for Edit *</Label>
                <Input value={editReason} onChange={e => setEditReason(e.target.value)}
                  placeholder="Why is this being changed?" />
              </div>
            </div>
          )}
          {!isEdit && (
            <div className="space-y-1.5">
              <Label>Event Type</Label>
              <Select value={eventType} onValueChange={(v) => setEventType(v as TimeEventType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="start">Start</SelectItem>
                  <SelectItem value="stop">Stop</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-1.5">
            <Label>Reason</Label>
            <Select value={reason} onValueChange={(v) => setReason(v as TimeReason)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {REASONS.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Notes (optional)</Label>
            <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
            {isEdit ? 'Save Changes' : 'Record'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function rebuildTime(original: string, timeStr: string): string {
  const d = new Date(original)
  const [h, m] = timeStr.split(':').map(Number)
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}
