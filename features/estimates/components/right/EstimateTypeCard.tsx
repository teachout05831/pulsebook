"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { EstimateDetail } from "@/types/estimate";

interface Props {
  estimate: EstimateDetail;
  onUpdate: (fields: Record<string, unknown>) => void;
}

export function EstimateTypeCard({ estimate, onUpdate }: Props) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between">
          <div>
            <div className="text-[9px] text-slate-400 uppercase font-semibold tracking-wider">Estimate Type</div>
            <Select value={estimate.pricingModel} onValueChange={(v) => onUpdate({ pricingModel: v })}>
              <SelectTrigger className="h-auto border-0 bg-transparent p-0 text-blue-600 font-medium text-[13px] shadow-none w-auto gap-1 [&>svg]:h-3 [&>svg]:w-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="flat">Flat Rate</SelectItem>
                <SelectItem value="per_service">Per Service</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-slate-400 uppercase font-semibold tracking-wider">Binding Type</div>
            <Select value={estimate.bindingType} onValueChange={(v) => onUpdate({ bindingType: v })}>
              <SelectTrigger className="h-auto border-0 bg-transparent p-0 text-blue-600 font-medium text-[13px] shadow-none w-auto gap-1 [&>svg]:h-3 [&>svg]:w-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="non_binding">Non-Binding</SelectItem>
                <SelectItem value="binding">Binding</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
