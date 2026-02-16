"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag } from "lucide-react";
import { TagSelector } from "@/features/tags";
import type { EstimateDetail } from "@/types/estimate";

interface Props {
  estimate: EstimateDetail;
  onUpdate: (fields: Record<string, unknown>) => void;
}

export function EstimateTagsCard({ estimate, onUpdate }: Props) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Tag className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg">Tags</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <TagSelector
          selectedTags={estimate.tags || []}
          onChange={(tags) => onUpdate({ tags })}
          entityType="estimate"
        />
      </CardContent>
    </Card>
  );
}
