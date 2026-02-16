"use client";

import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "../types/booking";

const STATUS_MAP: Record<BookingStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pending", variant: "secondary" },
  confirmed: { label: "Confirmed", variant: "default" },
  waitlisted: { label: "Waitlisted", variant: "outline" },
  declined: { label: "Declined", variant: "destructive" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  completed: { label: "Completed", variant: "default" },
  no_show: { label: "No Show", variant: "destructive" },
};

interface Props { status: BookingStatus }

export function BookingStatusBadge({ status }: Props) {
  const config = STATUS_MAP[status] || { label: status, variant: "secondary" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
