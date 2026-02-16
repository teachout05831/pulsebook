"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { EstimateBuilderSettings } from "@/types/company";

interface Props {
  settings: EstimateBuilderSettings;
  onUpdate: <K extends keyof EstimateBuilderSettings>(key: K, value: EstimateBuilderSettings[K]) => void;
}

export function HourlyDisplayConfig({ settings, onUpdate }: Props) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Hourly Display Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Show estimated hours to customers</Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              When enabled by default, new hourly estimates will display hour details on customer-facing pages.
            </p>
          </div>
          <Switch
            checked={settings.defaultShowEstimatedHours ?? false}
            onCheckedChange={(checked) => onUpdate("defaultShowEstimatedHours", checked)}
          />
        </div>

        <div className="rounded-md bg-muted/50 p-3 space-y-2">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Customer sees</p>
          <div className="text-xs space-y-1 text-muted-foreground">
            <p><strong>Hours hidden:</strong> Total price only (e.g. $1,800)</p>
            <p><strong>Hours shown:</strong> $150/hr × 2 crew × 6h = $1,800</p>
            <p><strong>With range:</strong> $150/hr × 2 crew, est. 6–8h ($1,800 – $2,400)</p>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            You can override this per estimate in the Resources card.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
