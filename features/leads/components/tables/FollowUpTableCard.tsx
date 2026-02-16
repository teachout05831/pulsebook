"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Phone, Mail, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { parseFollowUpDueDate } from "@/features/follow-ups/types";
import type { FollowUpWithUrgency } from "@/features/follow-ups/hooks/useFollowUps";

const TYPE_ICONS = { call: Phone, email: Mail, meeting: MapPin };

interface FollowUpTableCardProps {
  followUp: FollowUpWithUrgency;
  onComplete?: (id: string) => void;
}

function formatDueDate(date: Date) {
  const p = parseFollowUpDueDate(date);
  return p.displayTime ? `${p.displayDate} at ${p.displayTime}` : p.displayDate;
}

export function FollowUpTableCard({ followUp, onComplete }: FollowUpTableCardProps) {
  const router = useRouter();
  const Icon = TYPE_ICONS[followUp.type];
  const isOverdue = followUp.urgency === "overdue";

  return (
    <Card
      className={cn(
        "p-4 cursor-pointer hover:shadow-md transition-shadow border-l-4",
        isOverdue ? "border-l-red-500 bg-red-50/50" :
        followUp.urgency === "today" ? "border-l-amber-500" : "border-l-green-500"
      )}
      onClick={() => router.push(`/customers/${followUp.customerId}`)}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          className="h-4 w-4 mt-1 rounded cursor-pointer shrink-0"
          onClick={(e) => e.stopPropagation()}
          checked={false}
          onChange={() => onComplete?.(followUp.id)}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <span className="font-medium text-blue-600 truncate">{followUp.displayName}</span>
            <span className={cn(
              "shrink-0 px-2 py-0.5 rounded text-xs font-medium",
              followUp.status === "pending" && "bg-amber-100 text-amber-700",
              followUp.status === "completed" && "bg-green-100 text-green-700",
              followUp.status === "cancelled" && "bg-gray-100 text-gray-700"
            )}>
              {followUp.status.charAt(0).toUpperCase() + followUp.status.slice(1)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <Icon className={cn("h-4 w-4 shrink-0", isOverdue ? "text-red-500" : "text-slate-400")} />
            <span className={cn("truncate", isOverdue && "text-red-600 font-medium")}>
              {followUp.details || `${followUp.type} follow-up`}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className={cn("text-sm font-medium", isOverdue ? "text-red-600" : "text-muted-foreground")}>
              {formatDueDate(followUp.dueDate)}
            </span>
            {followUp.lastContactDate && (
              <span className="text-xs text-slate-500">
                Last contact: {(() => {
                  const d = Math.floor((Date.now() - new Date(followUp.lastContactDate).getTime()) / 86400000);
                  return d === 0 ? "Today" : d === 1 ? "Yesterday" : `${d}d ago`;
                })()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
