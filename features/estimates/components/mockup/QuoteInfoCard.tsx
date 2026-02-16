'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { FileText, Calendar } from 'lucide-react'

export function QuoteInfoCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Quote Info</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-700 border-green-200">
              Proposal
            </Badge>
            <Badge variant="outline">EST-042</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Service Type</Label>
            <Select defaultValue="long-distance">
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local-move">Local Move</SelectItem>
                <SelectItem value="long-distance">Long Distance Move</SelectItem>
                <SelectItem value="commercial">Commercial Move</SelectItem>
                <SelectItem value="storage">Storage</SelectItem>
                <SelectItem value="packing">Packing Services</SelectItem>
                <SelectItem value="labor">Labor Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Lead Status</Label>
            <Select defaultValue="proposal">
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="won">Won</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Issue Date</Label>
            <div className="flex items-center gap-2 h-9 px-3 border rounded-md text-sm">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              Feb 5, 2026
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Expiry Date</Label>
            <div className="flex items-center gap-2 h-9 px-3 border rounded-md text-sm">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              Mar 7, 2026
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
