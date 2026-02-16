'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DollarSign, Truck, Users, Home } from 'lucide-react'
import { HourlyPricingView } from './HourlyPricingView'
import { FlatRatePricingView } from './FlatRatePricingView'

export function PricingCard() {
  const [rateType, setRateType] = useState('hourly')

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Pricing</CardTitle>
          </div>
          <div className="flex border rounded-md overflow-hidden">
            <button
              onClick={() => setRateType('hourly')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                rateType === 'hourly'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background hover:bg-muted'
              }`}
            >
              Hourly Rate
            </button>
            <button
              onClick={() => setRateType('flat')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                rateType === 'flat'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background hover:bg-muted'
              }`}
            >
              Flat Rate
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Industry Fields - Moving Company */}
        <div className="rounded-md border bg-muted/30 p-4 space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Job Details
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1.5">
                <Home className="h-3 w-3" /> Property Type
              </Label>
              <Select defaultValue="apartment">
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="storage">Storage Unit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Size</Label>
              <Select defaultValue="1br">
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="1br">1 Bedroom</SelectItem>
                  <SelectItem value="2br">2 Bedroom</SelectItem>
                  <SelectItem value="3br">3 Bedroom</SelectItem>
                  <SelectItem value="4br">4+ Bedroom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1.5">
                <Truck className="h-3 w-3" /> Trucks Needed
              </Label>
              <Input type="number" defaultValue="2" className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1.5">
                <Users className="h-3 w-3" /> Crew Size
              </Label>
              <Input type="number" defaultValue="4" className="h-9" />
            </div>
          </div>
        </div>

        {rateType === 'hourly' && <HourlyPricingView />}
        {rateType === 'flat' && <FlatRatePricingView />}
      </CardContent>
    </Card>
  )
}
