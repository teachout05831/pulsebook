'use client'

import { useState } from 'react'
import { Loader2, Plus, AlertCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { useCustomFieldDefinitions } from '../hooks/useCustomFieldDefinitions'
import { SectionCard } from './SectionCard'
import { CustomFieldEditor } from './CustomFieldEditor'
import type { CustomFieldEntity, CustomFieldDefinition } from '../types'

export function CustomFieldsManager() {
  const [entityType, setEntityType] = useState<CustomFieldEntity>('customer')
  const { sections, isLoading, error, refresh, create, update, remove } = useCustomFieldDefinitions(entityType)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingField, setEditingField] = useState<CustomFieldDefinition | null>(null)
  const [defaultSection, setDefaultSection] = useState('General')
  const [deletingFieldId, setDeletingFieldId] = useState<string | null>(null)

  const existingSections = sections.length > 0
    ? sections.map((s) => s.name)
    : ['General']

  const handleAddField = (section: string) => {
    setDefaultSection(section)
    setEditingField(null)
    setEditorOpen(true)
  }

  const handleEditField = (field: CustomFieldDefinition) => {
    setEditingField(field)
    setDefaultSection(field.section)
    setEditorOpen(true)
  }

  const handleDeleteField = (id: string) => {
    setDeletingFieldId(id)
  }

  const confirmDelete = async () => {
    if (!deletingFieldId) return
    const result = await remove(deletingFieldId)
    if (result.error) toast.error(result.error)
    else toast.success('Field deleted')
    setDeletingFieldId(null)
  }

  const handleSave = async (data: Record<string, unknown>) => {
    if (editingField) {
      return await update(editingField.id, data)
    }
    return await create({ ...data, section: data.section || defaultSection })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={entityType === 'customer' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setEntityType('customer')}
          >
            Customers
          </Button>
          <Button
            variant={entityType === 'job' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setEntityType('job')}
          >
            Jobs
          </Button>
        </div>
        <Button size="sm" onClick={() => handleAddField(existingSections[0] || 'General')}>
          <Plus className="h-4 w-4 mr-1" /> Add Field
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mb-2" />
          <p className="text-destructive font-medium">Failed to load custom fields</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={refresh}>Try Again</Button>
        </div>
      ) : sections.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No custom fields defined for {entityType === 'customer' ? 'customers' : 'jobs'}.</p>
          <p className="text-sm mt-1">Click &quot;Add Field&quot; to create one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section) => (
            <SectionCard
              key={section.name}
              section={section}
              onAddField={handleAddField}
              onEditField={handleEditField}
              onDeleteField={handleDeleteField}
            />
          ))}
        </div>
      )}

      {editorOpen && (
        <CustomFieldEditor
          open={editorOpen}
          onClose={() => { setEditorOpen(false); setEditingField(null) }}
          onSave={handleSave}
          existingSections={existingSections}
          editingField={editingField}
        />
      )}

      <AlertDialog open={!!deletingFieldId} onOpenChange={() => setDeletingFieldId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Custom Field</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this custom field? This action cannot be undone.
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
