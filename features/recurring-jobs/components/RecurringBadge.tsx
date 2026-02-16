"use client";

import { RepeatIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RecurrenceConfig } from "@/types";
import { FREQUENCY_LABELS, DAY_LABELS } from "../types";

interface Props {
  config: RecurrenceConfig;
}

export function RecurringBadge({ config }: Props) {
  const freqLabel = FREQUENCY_LABELS[config.frequency];
  const dayNames = config.daysOfWeek
    .map((d) => DAY_LABELS.find((dl) => dl.value === d)?.label)
    .filter(Boolean)
    .join(", ");

  const text = dayNames ? `${freqLabel} on ${dayNames}` : freqLabel;

  return (
    <Badge variant="secondary" className="gap-1">
      <RepeatIcon className="h-3 w-3" />
      {text}
    </Badge>
  );
}
