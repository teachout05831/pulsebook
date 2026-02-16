'use client'

import { useState } from 'react'
import { Monitor, Smartphone, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { SectionRenderer } from '../sections/SectionRenderer'
import { ThemeProvider } from '../public/ThemeProvider'
import type { PageTemplate, BrandKit } from '../../types'

interface TemplatePreviewDialogProps {
  template: PageTemplate | null
  brandKit: BrandKit | null
  onClose: () => void
}

export function TemplatePreviewDialog({ template, brandKit, onClose }: TemplatePreviewDialogProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')

  if (!template) return null

  const visibleSections = template.sections.filter((s) => s.visible)

  return (
    <Dialog open={!!template} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="flex-row items-center justify-between px-4 py-3 border-b space-y-0">
          <DialogTitle className="text-sm font-semibold">{template.name}</DialogTitle>
          <div className="flex items-center gap-2">
            <Button variant={viewMode === 'desktop' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setViewMode('desktop')}>
              <Monitor className="h-3.5 w-3.5" />
            </Button>
            <Button variant={viewMode === 'mobile' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setViewMode('mobile')}>
              <Smartphone className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto bg-gray-100 flex justify-center p-4">
          <ThemeProvider theme={template.designTheme} brandKit={brandKit}>
            <div className={`bg-white shadow-sm rounded-lg overflow-hidden ${viewMode === 'mobile' ? 'w-[375px]' : 'w-full max-w-4xl'}`}>
              {visibleSections.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">
                  No visible sections in this template
                </div>
              ) : (
                visibleSections.map((s) => (
                  <SectionRenderer key={s.id} section={s} brandKit={brandKit} estimate={null} customer={null} pageId="" isPreview />
                ))
              )}
            </div>
          </ThemeProvider>
        </div>
      </DialogContent>
    </Dialog>
  )
}
