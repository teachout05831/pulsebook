"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TimelineEntry } from "@/features/interactions/components/TimelineEntry";
import { LogInteractionForm } from "@/features/interactions/components/LogInteractionForm";
import { useLeadTimeline } from "../../hooks/useLeadTimeline";
import type { Interaction, InteractionType, CreateInteractionInput } from "@/features/interactions/types";
import type { SalesFollowUp } from "../../hooks/useSalesTab";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "calls", label: "Calls" },
  { id: "texts", label: "Texts" },
  { id: "emails", label: "Emails" },
  { id: "meetings", label: "Meetings" },
  { id: "system", label: "System" },
] as const;

interface ActivityTabProps {
  interactions: Interaction[];
  followUps: SalesFollowUp[];
  onCreateInteraction: (input: Omit<CreateInteractionInput, "customerId">) => Promise<{ success?: boolean; error?: string }>;
  isLoading?: boolean;
  externalFormType?: InteractionType;
  onExternalFormClear?: () => void;
}

export function ActivityTab({ interactions, followUps, onCreateInteraction, isLoading, externalFormType, onExternalFormClear }: ActivityTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [defaultType, setDefaultType] = useState<InteractionType | undefined>();

  // Open form when triggered from parent (e.g. header Log dropdown)
  useEffect(() => {
    if (externalFormType) {
      setDefaultType(externalFormType);
      setShowForm(true);
      onExternalFormClear?.();
    }
  }, [externalFormType]); // eslint-disable-line react-hooks/exhaustive-deps
  const { grouped, filter, setFilter, totalCount } = useLeadTimeline(
    "", interactions, followUps
  );

  const openForm = (type?: InteractionType) => {
    setDefaultType(type);
    setShowForm(true);
  };

  if (isLoading) {
    return <div className="flex h-48 items-center justify-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-4">
      {/* Quick log + form */}
      {showForm ? (
        <LogInteractionForm defaultType={defaultType} onSubmit={onCreateInteraction} onCancel={() => setShowForm(false)} />
      ) : (
        <Button variant="outline" size="sm" onClick={() => openForm()} className="gap-1.5">
          <Plus className="h-4 w-4" /> Log Activity
        </Button>
      )}

      {/* Filters + timeline */}
      <Card>
        <div className="px-4 py-3 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h3 className="text-sm font-semibold">Activity Timeline</h3>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as typeof filter)}
                className={cn(
                  "text-xs px-3 py-1 rounded-full whitespace-nowrap transition-colors",
                  filter === f.id ? "bg-blue-100 text-blue-700 border border-blue-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-2">
          {totalCount === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No activity yet. Log your first interaction to get started.
            </div>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No matching activities for this filter.
            </div>
          ) : (
            Object.entries(grouped).map(([date, entries]) => (
              <div key={date} className="mb-4">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 pl-10">
                  {date}
                </div>
                <div className="divide-y divide-gray-100">
                  {entries.map((entry) => (
                    <TimelineEntry key={entry.id} entry={entry} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
