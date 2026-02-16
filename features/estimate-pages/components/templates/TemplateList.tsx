'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTemplates } from '../../hooks/useTemplates'
import type { BrandKit } from '../../types'
import { TemplateCard } from './TemplateCard'
import { CreateTemplateDialog } from './CreateTemplateDialog'
import { EditTemplateDialog } from './EditTemplateDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Plus, Search, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

const CATEGORIES = ['All', 'General', 'HVAC', 'Plumbing', 'Electrical', 'Landscaping', 'Cleaning']

export function TemplateList() {
  const router = useRouter()
  const { templates, isLoading, fetchTemplates, createTemplate, updateTemplate, duplicateTemplate, deleteTemplate } = useTemplates()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [settingsId, setSettingsId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [brandKit, setBrandKit] = useState<BrandKit | null>(null)

  useEffect(() => {
    fetch('/api/brand-kit').then((r) => r.ok ? r.json() : null).then((j) => { if (j?.data) setBrandKit(j.data) }).catch(() => {})
  }, [])

  const filtered = templates.filter((t) => {
    const matchesSearch = !searchQuery
      || t.name.toLowerCase().includes(searchQuery.toLowerCase())
      || (t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    const matchesCategory = categoryFilter === 'all'
      || (t.category?.toLowerCase() === categoryFilter.toLowerCase())
    return matchesSearch && matchesCategory
  })

  const handleEdit = (id: string) => router.push(`/estimate-pages/templates/${id}/builder`)
  const handleDuplicate = async (id: string) => {
    const result = await duplicateTemplate(id)
    if ('success' in result) toast.success('Template duplicated')
    else toast.error(result.error)
  }
  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    const result = await deleteTemplate(deleteId)
    if ('success' in result) toast.success('Template deleted')
    else toast.error(result.error)
    setDeleteId(null)
  }
  const handleSeed = async () => {
    const res = await fetch('/api/estimate-pages/templates/seed', { method: 'POST' })
    if (res.ok) { toast.success('Starter templates loaded'); await fetchTemplates() }
    else toast.error('Failed to load starter templates')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Template Library</h1>
          <p className="text-sm text-muted-foreground">Create and manage reusable estimate page templates</p></div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Template
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search templates..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-[220px] rounded-lg" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <p className="text-lg font-medium text-muted-foreground">No templates found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchQuery || categoryFilter !== 'all' ? 'Try adjusting your search or filter' : 'Create your first template or load our starter pack'}
          </p>
          {!searchQuery && categoryFilter === 'all' && (
            <Button variant="outline" className="mt-4" onClick={handleSeed}>
              <Sparkles className="mr-2 h-4 w-4" /> Load Starter Templates
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template) => (
            <TemplateCard key={template.id} template={template} brandKit={brandKit} onEdit={handleEdit}
              onSettings={(id) => setSettingsId(id)} onPreview={(id) => window.open(`/template-preview/${id}`, '_blank')}
              onDuplicate={handleDuplicate} onDelete={(id) => setDeleteId(id)} />
          ))}
        </div>
      )}
      <CreateTemplateDialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)} onCreate={createTemplate} />
      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete template?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <EditTemplateDialog template={templates.find((t) => t.id === settingsId) || null}
        onClose={() => setSettingsId(null)} onSave={updateTemplate} />
    </div>
  )
}
