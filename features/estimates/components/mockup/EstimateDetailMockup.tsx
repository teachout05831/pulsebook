'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import { QuoteInfoCard } from './QuoteInfoCard'
import { AddressCard } from './AddressCard'
import { NotesCard } from './NotesCard'
import { PricingCard } from './PricingCard'
import { SourceCard } from './SourceCard'
import { TagsCard } from './TagsCard'
import { ActionsCard } from './ActionsCard'

export function EstimateDetailMockup() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Estimates
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">EST-042</h1>
            <Badge className="bg-amber-100 text-amber-700 border-amber-200">
              Draft
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Save</Button>
          <Button size="sm">Send to Customer</Button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - left 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          <QuoteInfoCard />
          <AddressCard />
          <NotesCard />
          <PricingCard />
        </div>

        {/* Sidebar - right 1/3 */}
        <div className="space-y-6">
          <SourceCard />
          <TagsCard />
          <ActionsCard />
        </div>
      </div>

      {/* Mockup notice */}
      <div className="rounded-md border border-dashed border-amber-300 bg-amber-50 p-4 text-center">
        <p className="text-sm text-amber-700 font-medium">
          This is a design mockup with sample data. No real data is being loaded or saved.
        </p>
        <p className="text-xs text-amber-600 mt-1">
          Iterate on this layout, then we&apos;ll wire it up to real data.
        </p>
      </div>
    </div>
  )
}
