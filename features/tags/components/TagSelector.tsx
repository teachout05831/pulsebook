'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover'
import { useTags } from '../hooks/useTags'
import { TagBadge } from './TagBadge'
import type { TagEntityType } from '../types'

interface Props {
  selectedTags: string[]
  onChange: (tags: string[]) => void
  entityType?: TagEntityType
}

export function TagSelector({ selectedTags, onChange, entityType = 'customer' }: Props) {
  const { tags, isLoading, create } = useTags(entityType)
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const available = tags.filter(
    (t) => !selectedTags.includes(t.name) && t.name.toLowerCase().includes(search.toLowerCase())
  )

  const selectedTagObjects = tags.filter((t) => selectedTags.includes(t.name))

  const handleSelect = (name: string) => {
    onChange([...selectedTags, name])
    setSearch('')
  }

  const handleRemove = (name: string) => {
    onChange(selectedTags.filter((t) => t !== name))
  }

  const handleQuickAdd = async () => {
    if (!search.trim()) return
    const result = await create({ name: search.trim() })
    if (result.error) return
    handleSelect(search.trim())
    setSearch('')
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {selectedTagObjects.map((tag) => (
          <TagBadge
            key={tag.id}
            name={tag.name}
            color={tag.color}
            onRemove={() => handleRemove(tag.name)}
          />
        ))}
        {selectedTags
          .filter((name) => !tags.find((t) => t.name === name))
          .map((name) => (
            <TagBadge
              key={name}
              name={name}
              color="#6B7280"
              onRemove={() => handleRemove(name)}
            />
          ))}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <Plus className="h-3 w-3 mr-1" /> Add Tag
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-2" align="start">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search or create..."
            className="h-8 text-sm mb-2"
          />
          <div className="max-h-40 overflow-y-auto space-y-0.5">
            {isLoading ? (
              <p className="text-xs text-muted-foreground p-2">Loading...</p>
            ) : available.length === 0 && !search.trim() ? (
              <p className="text-xs text-muted-foreground p-2">No tags available</p>
            ) : (
              <>
                {available.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded hover:bg-gray-100 text-left"
                    onClick={() => handleSelect(tag.name)}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                  </button>
                ))}
                {search.trim() && !tags.find((t) => t.name.toLowerCase() === search.toLowerCase()) && (
                  <button
                    type="button"
                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded hover:bg-gray-100 text-left text-blue-600"
                    onClick={handleQuickAdd}
                  >
                    <Plus className="h-3 w-3" />
                    Create &quot;{search.trim()}&quot;
                  </button>
                )}
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
