'use client'

import { useRouter } from 'next/navigation'
import { Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContractBuilder } from './ContractBuilder'
import { useContractBuilderPage } from '../hooks/useContractBuilderPage'

interface Props {
  templateId: string
}

export function ContractBuilderLoader({ templateId }: Props) {
  const router = useRouter()
  const { template, isLoading, handleSave } = useContractBuilderPage(templateId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-sm text-destructive">Template not found</p>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex items-center gap-2 px-4 py-2 border-b bg-white">
        <Button variant="ghost" size="sm" onClick={() => router.push('/settings')}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Settings
        </Button>
        <span className="text-sm text-muted-foreground">{template.name}</span>
      </div>
      <div className="flex-1 overflow-hidden">
        <ContractBuilder
          templateId={templateId}
          initialBlocks={template.blocks || []}
          onSave={handleSave}
        />
      </div>
    </div>
  )
}
