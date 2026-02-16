'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Pencil, Copy, Trash2, Star, Eye, Settings2, Link } from 'lucide-react'
import { toast } from 'sonner'
import { SectionRenderer } from '../sections/SectionRenderer'
import { ThemeProvider } from '../public/ThemeProvider'
import type { PageTemplate, BrandKit } from '../../types'

interface TemplateCardProps {
  template: PageTemplate
  brandKit: BrandKit | null
  onEdit: (id: string) => void
  onSettings: (id: string) => void
  onPreview: (id: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  return `${months[date.getMonth()]} ${date.getDate()}`
}

export function TemplateCard({
  template,
  brandKit,
  onEdit,
  onSettings,
  onPreview,
  onDuplicate,
  onDelete,
}: TemplateCardProps) {
  const sectionCount = template.sections.length
  const visibleSections = template.sections.filter((s) => s.visible)

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      onClick={() => onEdit(template.id)}
    >
      <div className="relative h-40 overflow-hidden bg-gray-50">
        {visibleSections.length > 0 ? (
          <div className="pointer-events-none origin-top-left" style={{ transform: 'scale(0.25)', width: '400%', height: '400%' }}>
            <ThemeProvider theme={template.designTheme} brandKit={brandKit}>
              {visibleSections.slice(0, 4).map((s) => (
                <SectionRenderer key={s.id} section={s} brandKit={brandKit} estimate={null} customer={null} pageId="" isPreview />
              ))}
            </ThemeProvider>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <Badge variant="secondary" className="bg-white/90 text-gray-700">Empty template</Badge>
          </div>
        )}

        <div className="absolute left-2 top-2 flex gap-1.5">
          {template.isDefault && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-white">
              <Star className="h-3.5 w-3.5 fill-current" />
            </span>
          )}
          {template.isSystem && (
            <Badge variant="secondary" className="bg-white/90 text-xs font-medium text-gray-600">
              System
            </Badge>
          )}
          <Badge variant="secondary" className="bg-white/90 text-gray-700 text-xs">
            {sectionCount} {sectionCount === 1 ? 'section' : 'sections'}
          </Badge>
        </div>

        <div
          className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/90 shadow-sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(template.id)}>
                <Pencil className="mr-2 h-4 w-4" />
                Open Builder
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPreview(template.id)}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={async () => {
                const url = `${window.location.origin}/template-preview/${template.id}`
                await navigator.clipboard.writeText(url)
                toast.success('Preview link copied')
              }}>
                <Link className="mr-2 h-4 w-4" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSettings(template.id)}>
                <Settings2 className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(template.id)}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                disabled={template.isSystem}
                onClick={() => onDelete(template.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardContent className="space-y-2 p-4">
        <h3 className="truncate font-medium text-gray-900">{template.name}</h3>

        <div className="flex items-center gap-2">
          {template.category && (
            <Badge variant="outline" className="text-xs">
              {template.category}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            Created {formatDate(template.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
