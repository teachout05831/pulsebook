'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useContractTemplates } from '../hooks/useContractTemplates'
import type { ContractTemplate, CreateInstanceInput } from '../types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  jobId: string
  customerId: string
  onCreate: (input: CreateInstanceInput) => Promise<{ error?: string; success?: boolean }>
}

export function CreateContractDialog({ open, onOpenChange, jobId, customerId, onCreate }: Props) {
  const { templates, isLoading } = useContractTemplates()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const activeTemplates = templates.filter((t) => t.isActive)

  const handleCreate = async () => {
    if (!selectedId) return
    setIsCreating(true)
    const result = await onCreate({
      templateId: selectedId,
      jobId,
      customerId,
    })
    setIsCreating(false)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Contract created')
      setSelectedId(null)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Contract</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : activeTemplates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No active contract templates.</p>
            <p className="text-xs mt-1">Create and activate templates in Settings.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {activeTemplates.map((template: ContractTemplate) => (
              <TemplateOption
                key={template.id}
                template={template}
                isSelected={selectedId === template.id}
                onSelect={() => setSelectedId(template.id)}
              />
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={isCreating || !selectedId}>
            {isCreating && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function TemplateOption({ template, isSelected, onSelect }: {
  template: ContractTemplate
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      className={`w-full text-left rounded-lg border p-3 transition-colors ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{template.name}</p>
        <Badge variant="outline" className="text-xs">{template.category}</Badge>
      </div>
      {template.description && (
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{template.description}</p>
      )}
      <p className="text-xs text-muted-foreground mt-1">
        {template.blocks?.length || 0} blocks
      </p>
    </button>
  )
}
