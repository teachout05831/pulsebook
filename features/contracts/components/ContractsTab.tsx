'use client'

import { useState } from 'react'
import { Loader2, Plus, ScrollText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useContractInstances } from '../hooks/useContractInstances'
import { ContractInstanceCard } from './ContractInstanceCard'
import { ContractViewer } from './ContractViewer'
import { ContractLiveView } from './ContractLiveView'
import { CreateContractDialog } from './CreateContractDialog'
import { LiveProgressTimeline } from './LiveProgressTimeline'
import type { ContractStatus } from '../types'

const ACTIVE_STATUSES: ContractStatus[] = ['sent', 'viewed', 'signed']

interface Props {
  jobId: string
  customerId: string
}

export function ContractsTab({ jobId, customerId }: Props) {
  const { instances, isLoading, error, create, refresh } = useContractInstances(jobId)
  const [viewingId, setViewingId] = useState<string | null>(null)
  const [liveId, setLiveId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const handleSend = async (id: string) => {
    const res = await fetch(`/api/contracts/instances/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'sent' }),
    })
    const json = await res.json()
    if (!res.ok) {
      toast.error(json.error || 'Failed to send')
    } else {
      toast.success('Contract sent to customer')
      refresh()
    }
  }

  const handleUpdateStatus = async (id: string, status: ContractStatus) => {
    const res = await fetch(`/api/contracts/instances/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    const json = await res.json()
    if (!res.ok) {
      toast.error(json.error || 'Failed to update')
    } else {
      toast.success('Contract updated')
      refresh()
    }
  }

  if (liveId) {
    return <ContractLiveView instanceId={liveId} onClose={() => { setLiveId(null); refresh() }} />
  }

  if (viewingId) {
    return <ContractViewer instanceId={viewingId} onClose={() => setViewingId(null)} />
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-destructive text-center py-8">{error}</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {instances.length} contract{instances.length !== 1 ? 's' : ''}
        </p>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Create Contract
        </Button>
      </div>

      {instances.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ScrollText className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No contracts for this job yet.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Create First Contract
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg">
          {instances.map((instance) => (
            <div key={instance.id}>
              <ContractInstanceCard
                instance={instance}
                onView={setViewingId}
                onStartLive={setLiveId}
                onSend={handleSend}
                onUpdateStatus={handleUpdateStatus}
              />
              {ACTIVE_STATUSES.includes(instance.status) && (
                <div className="px-4 pb-3 border-b last:border-b-0">
                  <LiveProgressTimeline contractId={instance.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <CreateContractDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        jobId={jobId}
        customerId={customerId}
        onCreate={create}
      />
    </div>
  )
}
