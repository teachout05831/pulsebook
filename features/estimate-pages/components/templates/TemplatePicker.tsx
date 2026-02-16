'use client'

import { useState, useEffect } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Search, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCreatePage } from '../../hooks/useCreatePage'
import type { PageTemplate } from '../../types'

const gradients = [
  'from-blue-400 to-indigo-500',
  'from-emerald-400 to-teal-500',
  'from-orange-400 to-rose-500',
  'from-violet-400 to-purple-500',
  'from-cyan-400 to-blue-500',
  'from-pink-400 to-fuchsia-500',
]

interface TemplatePickerProps {
  open: boolean
  onClose: () => void
  estimateId: string
  onCreated: (pageId: string) => void
}

export function TemplatePicker({ open, onClose, estimateId, onCreated }: TemplatePickerProps) {
  const [templates, setTemplates] = useState<PageTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const { createPage, isCreating } = useCreatePage()

  useEffect(() => {
    if (!open) return
    setIsLoading(true)
    fetch('/api/estimate-pages/templates')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then((json) => setTemplates(json.data || []))
      .catch(() => toast.error('Failed to load templates'))
      .finally(() => setIsLoading(false))
  }, [open])

  const filtered = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = async (templateId?: string) => {
    const result = await createPage({ estimateId, templateId })
    if ('error' in result) {
      toast.error(result.error)
      return
    }
    toast.success('Estimate page created')
    onCreated(result.id)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {isCreating && (
          <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Creating page...</span>
          </div>
        )}

        {!isCreating && isLoading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-lg" />
            ))}
          </div>
        )}

        {!isCreating && !isLoading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {/* Start from Scratch */}
            <button
              type="button"
              onClick={() => handleSelect()}
              className="flex h-44 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Plus className="h-8 w-8" />
              <span className="text-sm font-medium">Start from Scratch</span>
            </button>

            {filtered.map((template) => {
              const gradient = gradients[template.sections.length % gradients.length]
              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleSelect(template.id)}
                  className="group overflow-hidden rounded-lg border bg-card text-left transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className={`flex h-20 items-center justify-center bg-gradient-to-br ${gradient}`}>
                    <Badge variant="secondary" className="bg-white/90 text-gray-700">
                      {template.sections.length}{' '}
                      {template.sections.length === 1 ? 'section' : 'sections'}
                    </Badge>
                  </div>
                  <div className="space-y-1 p-3">
                    <p className="truncate text-sm font-medium">{template.name}</p>
                    {template.description && (
                      <p className="line-clamp-2 text-xs text-muted-foreground">{template.description}</p>
                    )}
                    {template.category && (
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose} disabled={isCreating}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
