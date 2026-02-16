'use client'

import { useState } from 'react'
import { Clock, Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTimeTracking } from '../hooks/useTimeTracking'
import { TimeEntryRow } from './TimeEntryRow'
import { TimeTrackingSummary } from './TimeTrackingSummary'
import { TimeEntryDialog } from './TimeEntryDialog'

interface Props {
  contractId: string
  hourlyRate?: number
}

export function TimeTrackingTable({ contractId, hourlyRate }: Props) {
  const { pairs, totals, isLoading, error, canEdit, record, update } = useTimeTracking(contractId)
  const [dialogOpen, setDialogOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-destructive text-center py-4">{error}</p>
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h4 className="text-sm font-medium">Time Tracking</h4>
        </div>
        <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Entry
        </Button>
      </div>

      {pairs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border rounded-lg">
          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No time entries recorded yet.</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-xs text-muted-foreground">
                <th className="px-3 py-2 text-left w-10">#</th>
                <th className="px-3 py-2 text-left">Start</th>
                <th className="px-3 py-2 text-left">End</th>
                <th className="px-3 py-2 text-left">Duration</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-left">Billable</th>
                <th className="px-3 py-2 text-left">Notes</th>
                <th className="px-3 py-2 text-left w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pairs.map((pair, i) => (
                <TimeEntryRow key={pair.start.id} pair={pair} index={i} canEdit={canEdit} onUpdate={update} />
              ))}
            </tbody>
          </table>
          <TimeTrackingSummary
            totalHours={totals.totalHours}
            billableHours={totals.billableHours}
            breakHours={totals.breakHours}
            hourlyRate={hourlyRate}
          />
        </div>
      )}

      <TimeEntryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        contractId={contractId}
        onRecord={record}
      />
    </div>
  )
}
