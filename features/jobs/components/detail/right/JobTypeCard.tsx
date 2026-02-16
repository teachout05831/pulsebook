"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { JobDetail } from "@/types/job";

interface Props {
  job: JobDetail;
  onUpdate: (fields: Record<string, unknown>) => void;
}

export function JobTypeCard({ job, onUpdate }: Props) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between">
          <div>
            <div className="text-[9px] text-slate-400 uppercase font-semibold tracking-wider">Pricing Model</div>
            <Select value={job.pricingModel || undefined} onValueChange={(v) => onUpdate({ pricingModel: v })}>
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
            <div className="text-[9px] text-slate-400 uppercase font-semibold tracking-wider">Tax Rate</div>
            <div className="flex items-center gap-0.5">
              <Input
                type="number"
                className="h-6 w-14 border-0 bg-transparent p-0 text-[13px] text-right shadow-none font-medium text-blue-600"
                value={job.taxRate || ""}
                onChange={(e) => onUpdate({ taxRate: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
              <span className="text-[13px] text-blue-600 font-medium">%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
