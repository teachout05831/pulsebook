'use client'

import { useState } from 'react'
import { Loader2, Plus, Pencil, Trash2, AlertCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { useTags } from '../hooks/useTags'
import { TagEditor } from './TagEditor'
import { TagBadge } from './TagBadge'
import type { Tag, TagEntityType } from '../types'

interface TagsManagerProps {
  entityType?: TagEntityType
}

export function TagsManager({ entityType = 'customer' }: TagsManagerProps) {
  const { tags, isLoading, error, refresh, create, update, remove } = useTags(entityType)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [deletingTag, setDeletingTag] = useState<Tag | null>(null)

  const handleAdd = () => {
    setEditingTag(null)
    setEditorOpen(true)
  }

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag)
    setEditorOpen(true)
  }

  const handleDelete = (tag: Tag) => {
    if (tag.source === 'external') {
      toast.error('Cannot delete externally synced tags')
      return
    }
    setDeletingTag(tag)
  }

  const confirmDelete = async () => {
    if (!deletingTag) return
    const result = await remove(deletingTag.id)
    if (result.error) toast.error(result.error)
    else toast.success('Tag deleted')
    setDeletingTag(null)
  }

  const handleSave = async (data: { name: string; color: string }) => {
    if (editingTag) {
      return await update(editingTag.id, data)
    }
    return await create(data)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Tags help categorize and filter {entityType === 'job' ? 'jobs' : 'customers'}.
          </p>
        </div>
        <Button size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-1" /> Add Tag
        </Button>
      </div>

      {isLoading ? (
        <div className="border rounded-lg p-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-7 w-14 ml-auto" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mb-2" />
          <p className="text-destructive font-medium">Failed to load tags</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={refresh}>Try Again</Button>
        </div>
      ) : tags.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No tags defined yet.</p>
          <p className="text-sm mt-1">Click &quot;Add Tag&quot; to create one.</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-muted-foreground border-b">
                <th className="text-left p-3 font-medium">Tag</th>
                <th className="text-left p-3 font-medium">Source</th>
                <th className="w-20 p-3" />
              </tr>
            </thead>
            <tbody>
              {tags.map((tag) => (
                <tr key={tag.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-3"><TagBadge name={tag.name} color={tag.color} size="md" /></td>
                  <td className="p-3"><Badge variant="outline" className="text-xs">{tag.source}</Badge></td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(tag)}><Pencil className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => handleDelete(tag)} disabled={tag.source === 'external'}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editorOpen && (
        <TagEditor
          open={editorOpen}
          onClose={() => { setEditorOpen(false); setEditingTag(null) }}
          onSave={handleSave}
          editingTag={editingTag}
        />
      )}

      <AlertDialog open={!!deletingTag} onOpenChange={() => setDeletingTag(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingTag?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
