"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PipelineStage {
  label: string;
  count: number;
  percent: number;
  color: string;
}

interface PipelineCardProps {
  pipelineData: PipelineStage[];
}

export function PipelineCard({ pipelineData }: PipelineCardProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sales Pipeline</CardTitle>
        <Button variant="link" className="text-sm">View All</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {pipelineData.map((stage) => (
          <div key={stage.label} className="flex items-center gap-4">
            <span className="w-20 text-sm text-muted-foreground">{stage.label}</span>
            <div className="flex-1 h-6 bg-slate-100 rounded overflow-hidden">
              <div
                className={cn("h-full rounded flex items-center px-2 text-xs font-semibold text-white", stage.color)}
                style={{ width: `${Math.max(stage.percent, 5)}%` }}
              >
                {stage.count}
              </div>
            </div>
            <span className="w-8 text-sm font-semibold text-right">{stage.count}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
