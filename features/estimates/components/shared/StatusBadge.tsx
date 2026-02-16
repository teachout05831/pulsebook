"use client";

import { Badge } from "@/components/ui/badge";
import type { EstimateStatus } from "@/types/estimate";
import { ESTIMATE_STATUS_LABELS, ESTIMATE_STATUS_COLORS } from "@/types/estimate";

interface Props {
  status: EstimateStatus;
}

export function StatusBadge({ status }: Props) {
  return (
    <Badge variant="secondary" className={ESTIMATE_STATUS_COLORS[status]}>
      {ESTIMATE_STATUS_LABELS[status]}
    </Badge>
  );
}
