"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFollowUps } from "@/features/follow-ups";
import { FollowUpCard } from "./FollowUpCard";

type FollowUpFilter = "all" | "overdue" | "today" | "upcoming";

export function FollowUpList() {
  const [filter, setFilter] = useState<FollowUpFilter>("all");
  const { followUps, overdue, today, upcoming, isLoading, handleComplete } = useFollowUps();

  const filteredFollowUps = filter === "all"
    ? followUps
    : filter === "overdue" ? overdue
    : filter === "today" ? today
    : upcoming;

  const counts = {
    all: followUps.length,
    overdue: overdue.length,
    today: today.length,
    upcoming: upcoming.length,
  };

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["all", "overdue", "today", "upcoming"] as FollowUpFilter[]).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className="gap-2"
          >
            {f !== "all" && (
              <span className={cn(
                "h-2 w-2 rounded-full",
                f === "overdue" ? "bg-red-500" : f === "today" ? "bg-amber-500" : "bg-green-500"
              )} />
            )}
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className={cn(
              "px-1.5 py-0.5 rounded text-xs",
              filter === f ? "bg-white/20" : "bg-slate-100"
            )}>
              {counts[f]}
            </span>
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredFollowUps.map((item) => (
          <FollowUpCard key={item.id} item={item} onComplete={handleComplete} />
        ))}

        {filteredFollowUps.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No follow-ups in this category
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
