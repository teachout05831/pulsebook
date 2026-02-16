'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Loader2 } from 'lucide-react'
import { useTemplateLoader } from '../../hooks/useTemplateLoader'
import { WIDGET_SECTION_TYPES } from '../../types/constants'
import type { PageSection, DesignTheme } from '../../types'

const GRADIENTS = [
  'from-blue-400 to-indigo-500',
  'from-emerald-400 to-teal-500',
  'from-orange-400 to-rose-500',
  'from-violet-400 to-purple-500',
  'from-cyan-400 to-blue-500',
  'from-pink-400 to-fuchsia-500',
]

interface WidgetTemplatePickerProps {
  open: boolean
  onClose: () => void
  onTemplateSelected: (data: { sections: PageSection[], designTheme: DesignTheme }) => void
}

export function WidgetTemplatePicker({ open, onClose, onTemplateSelected }: WidgetTemplatePickerProps) {
  const [search, setSearch] = useState('')
  const { templates, isLoading, isApplying, loadTemplate, filterTemplates } = useTemplateLoader({ open })

  const filtered = filterTemplates(templates, search)

  const handleSelect = async (templateId: string) => {
    await loadTemplate(templateId, (data) => {
      onTemplateSelected(data)
      onClose()
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v && !isApplying) onClose() }}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Load from Template</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Choose a template to load its design and sections into your widget
          </p>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search templates..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        {isApplying && (
          <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading template...</span>
          </div>
        )}

        {!isApplying && isLoading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-lg" />
            ))}
          </div>
        )}

        {!isApplying && !isLoading && (
          <>
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No templates found matching "{search}"
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {filtered.map((template) => {
                  const gradient = GRADIENTS[template.sections.length % GRADIENTS.length]
                  const compatibleCount = template.sections.filter((s) =>
                    WIDGET_SECTION_TYPES.includes(s.type)
                  ).length

                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => handleSelect(template.id)}
                      className="group overflow-hidden rounded-lg border bg-card text-left transition-all hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className={`flex h-20 items-center justify-center bg-gradient-to-br ${gradient}`}>
                        <Badge variant="secondary" className="bg-white/90 text-gray-700">
                          {compatibleCount} {compatibleCount === 1 ? 'section' : 'sections'}
                        </Badge>
                      </div>
                      <div className="space-y-1 p-3">
                        <p className="truncate text-sm font-medium">{template.name}</p>
                        {template.description && (
                          <p className="line-clamp-2 text-xs text-muted-foreground">{template.description}</p>
                        )}
                        {template.category && (
                          <Badge variant="outline" className="text-xs">{template.category}</Badge>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose} disabled={isApplying}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
