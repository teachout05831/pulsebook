"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { AlertTriangle, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmCompleteDialog } from "@/features/follow-ups/components/ConfirmCompleteDialog";
import { parseFollowUpDueDate } from "@/features/follow-ups/types";
import type { FollowUpWithUrgency } from "@/features/follow-ups";

function getTypeColor(type: "call" | "email" | "meeting") {
  switch (type) {
    case "call": return "bg-blue-100 text-blue-700";
    case "email": return "bg-purple-100 text-purple-700";
    case "meeting": return "bg-green-100 text-green-700";
  }
}

function formatDueDate(date: Date) {
  const p = parseFollowUpDueDate(date);
  return p.displayTime ? `${p.displayDate} at ${p.displayTime}` : p.displayDate;
}

interface FollowUpCardProps {
  item: FollowUpWithUrgency;
  onComplete: (id: string) => void;
}

export function FollowUpCard({ item, onComplete }: FollowUpCardProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  return (
    <>
    <Card
      className={cn(
        "border-l-4 cursor-pointer hover:shadow-md transition-shadow",
        item.urgency === "overdue" ? "border-l-red-500" :
        item.urgency === "today" ? "border-l-amber-500" : "border-l-green-500"
      )}
      onClick={() => router.push(`/customers/${item.customerId}`)}
    >
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
          <input
            type="checkbox"
            className="h-5 w-5 mt-1 rounded cursor-pointer shrink-0"
            checked={false}
            onClick={(e) => e.stopPropagation()}
            onChange={() => setShowConfirm(true)}
          />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-blue-600 hover:underline">{item.displayName}</span>
              <span className={cn("px-2 py-0.5 rounded text-xs font-medium", getTypeColor(item.type))}>
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </span>
            </div>
            {item.details && <p className="text-sm text-muted-foreground">{item.details}</p>}
            <div className={cn(
              "flex items-center gap-2 text-sm font-medium",
              item.urgency === "overdue" ? "text-red-600" :
              item.urgency === "today" ? "text-amber-600" : "text-muted-foreground"
            )}>
              {item.urgency === "overdue" ? (
                <>
                  <AlertTriangle className="h-4 w-4" />
                  Overdue by {item.daysOverdue} day{item.daysOverdue > 1 ? "s" : ""} ({formatDueDate(item.dueDate)})
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4" />
                  {formatDueDate(item.dueDate)}
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
            <Button size="sm" onClick={() => router.push(`/customers/${item.customerId}`)}>
              {item.type === "call" ? "Call Now" : item.type === "email" ? "Send Email" : "View"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push(`/customers/${item.customerId}`)}>
              Reschedule
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
    <ConfirmCompleteDialog open={showConfirm} onOpenChange={setShowConfirm} onConfirm={() => { onComplete(item.id); setShowConfirm(false); }} displayName={item.displayName} />
    </>
  );
}
