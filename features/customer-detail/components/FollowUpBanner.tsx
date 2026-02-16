"use client";

import { Bell, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SalesFollowUp } from "../hooks/useSalesTab";

const TYPE_ICONS = { call: Phone, email: Mail, meeting: MapPin };

interface FollowUpBannerProps {
  followUp: SalesFollowUp;
  onComplete: (id: string) => void;
  onReschedule?: (id: string) => void;
}

export function FollowUpBanner({ followUp, onComplete, onReschedule }: FollowUpBannerProps) {
  const Icon = TYPE_ICONS[followUp.type] || Bell;
  const isOverdue = followUp.urgency === "overdue";
  const isToday = followUp.urgency === "today";

  return (
    <div className={`rounded-lg border p-3 sm:p-4 mb-4 flex flex-col sm:flex-row sm:items-center gap-3 ${
      isOverdue ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
    }`}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
          isOverdue ? "bg-red-400 text-white" : "bg-amber-400 text-white"
        }`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className={`text-sm font-semibold ${isOverdue ? "text-red-800" : "text-amber-800"}`}>
            {isOverdue ? `Follow-up Overdue (${followUp.daysOverdue}d)` : isToday ? "Follow-up Due Today" : "Upcoming Follow-up"}
          </div>
          {followUp.details && (
            <p className={`text-sm mt-0.5 truncate ${isOverdue ? "text-red-700" : "text-amber-700"}`}>
              {followUp.type} — &ldquo;{followUp.details}&rdquo;
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button
          size="sm"
          className={isOverdue ? "bg-red-500 hover:bg-red-600 text-white" : "bg-amber-500 hover:bg-amber-600 text-white"}
          onClick={() => onComplete(followUp.id)}
        >
          Complete
        </Button>
        {onReschedule && (
          <Button size="sm" variant="outline" onClick={() => onReschedule(followUp.id)}>
            Reschedule
          </Button>
        )}
      </div>
    </div>
  );
}
