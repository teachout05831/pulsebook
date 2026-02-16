'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Navigation, ArrowDown, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

const stops = [
  {
    type: 'origin',
    label: 'Pickup',
    address: '123 Oak Street, Apt 4B',
    city: 'Austin, TX 78701',
    notes: '1st floor apartment, narrow hallway',
  },
  {
    type: 'stop',
    label: 'Stop 1 - Storage',
    address: 'SecureStore Unit B4, 890 Industrial Blvd',
    city: 'Austin, TX 78745',
    notes: 'Drop off 10 boxes only',
  },
  {
    type: 'destination',
    label: 'Delivery',
    address: '456 Maple Avenue, Unit 12',
    city: 'San Antonio, TX 78205',
    notes: '2nd floor apartment, elevator available',
  },
]

export function AddressCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Addresses</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            3 stops
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-0">
          {stops.map((stop, index) => (
            <div key={stop.address} className="relative">
              {/* Connector line */}
              {index < stops.length - 1 && (
                <div className="absolute left-[15px] top-[36px] bottom-0 w-px border-l-2 border-dashed border-muted-foreground/30" />
              )}

              <div className="flex gap-3 pb-4">
                {/* Icon */}
                <div className="relative z-10 flex-shrink-0 mt-0.5">
                  {stop.type === 'origin' && (
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Navigation className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                  {stop.type === 'stop' && (
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <ArrowDown className="h-4 w-4 text-amber-600" />
                    </div>
                  )}
                  {stop.type === 'destination' && (
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {stop.label}
                  </p>
                  <p className="text-sm font-medium mt-0.5">{stop.address}</p>
                  <p className="text-sm text-muted-foreground">{stop.city}</p>
                  {stop.notes && (
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      {stop.notes}
                    </p>
                  )}
                </div>

                {/* Map link */}
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
