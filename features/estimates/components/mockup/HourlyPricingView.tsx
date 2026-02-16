import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Clock } from 'lucide-react'

export function HourlyPricingView() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs flex items-center gap-1.5">
            <Clock className="h-3 w-3" /> Hourly Rate
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
            <Input defaultValue="185" className="h-9 pl-7" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Est. Hours</Label>
          <Input type="number" defaultValue="6" className="h-9" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Travel Time</Label>
          <Input type="number" defaultValue="1.5" className="h-9" />
        </div>
      </div>

      {/* Hourly Summary */}
      <div className="rounded-md border p-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Labor (6 hrs x $185/hr)</span>
          <span>$1,110.00</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Travel time (1.5 hrs x $185/hr)</span>
          <span>$277.50</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Materials & supplies</span>
          <span>$150.00</span>
        </div>
        <div className="border-t pt-2 flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">$1,537.50</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (8%)</span>
          <span>$123.00</span>
        </div>
        <div className="border-t pt-2 flex justify-between">
          <span className="font-semibold">Total</span>
          <span className="font-semibold text-lg">$1,660.50</span>
        </div>
      </div>
    </div>
  )
}
