'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User, UserCheck, Building2, Map } from 'lucide-react'

export function SourceCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Source & Assignment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <User className="h-3 w-3" /> Customer
          </Label>
          <div className="flex items-center gap-2 h-9 px-3 border rounded-md bg-muted/30">
            <span className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">
              Johnson Family
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <UserCheck className="h-3 w-3" /> Sales Rep
          </Label>
          <Select defaultValue="mike">
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mike">Mike Thompson</SelectItem>
              <SelectItem value="sarah">Sarah Chen</SelectItem>
              <SelectItem value="david">David Rodriguez</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <UserCheck className="h-3 w-3" /> Estimator
          </Label>
          <Select defaultValue="sarah">
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mike">Mike Thompson</SelectItem>
              <SelectItem value="sarah">Sarah Chen</SelectItem>
              <SelectItem value="david">David Rodriguez</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Building2 className="h-3 w-3" /> Branch
          </Label>
          <Input defaultValue="Austin Main" className="h-9" />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Map className="h-3 w-3" /> Region
          </Label>
          <Input defaultValue="Central Texas" className="h-9" />
        </div>
      </CardContent>
    </Card>
  )
}
