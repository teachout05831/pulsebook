'use client'

import { Eye, Pencil, Play, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import type { ContractTemplate } from '../types'

interface Props {
  template: ContractTemplate
  onPreview: (template: ContractTemplate) => void
  onTestLive: (template: ContractTemplate) => void
  onEdit: (template: ContractTemplate) => void
  onToggleActive: (id: string, isActive: boolean) => void
  onDelete: (id: string) => void
}

export function ContractTemplateCard({
  template,
  onPreview,
  onTestLive,
  onEdit,
  onToggleActive,
  onDelete,
}: Props) {
  const blockCount = template.blocks?.length ?? 0

  return (
    <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium truncate">{template.name}</p>
            <Badge variant="outline" className="text-xs shrink-0">
              {template.category}
            </Badge>
            {template.isActive ? (
              <Badge className="bg-green-100 text-green-700 text-xs shrink-0">
                Active
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs shrink-0">
                Inactive
              </Badge>
            )}
            {template.attachmentMode === 'auto' && (
              <Badge className="bg-purple-100 text-purple-700 text-xs shrink-0">Auto</Badge>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span>{blockCount} {blockCount === 1 ? 'block' : 'blocks'}</span>
            {template.designTheme && (
              <span>Theme: {template.designTheme}</span>
            )}
            {template.attachmentMode === 'auto' && template.appliesTo.length > 0 && (
              <span>Applies to: {template.appliesTo.join(', ')}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-4">
        <Switch
          checked={template.isActive}
          onCheckedChange={(checked) => onToggleActive(template.id, checked)}
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onPreview(template)}
          title="Preview"
        >
          <Eye className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-blue-600"
          onClick={() => onTestLive(template)}
          title="Test Live"
        >
          <Play className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onEdit(template)}
          title="Edit in Builder"
        >
          <Pencil className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-red-500"
          onClick={() => onDelete(template.id)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
