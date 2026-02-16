"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Loader2, Zap } from "lucide-react";
import { useActivityLog } from "../hooks/useActivityLog";
import { ActivityEntryRow } from "./ActivityEntry";

interface Props {
  open: boolean;
  onClose: () => void;
  entityType: "estimate" | "job";
  entityId: string;
}

export function ActivityPanel({ open, onClose, entityType, entityId }: Props) {
  const { entries, isLoading } = useActivityLog(open, entityType, entityId);

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="p-0 w-[380px] sm:max-w-[380px]">
        <div className="bg-slate-800 text-white px-5 py-4 sticky top-0 z-10">
          <SheetHeader>
            <SheetTitle className="text-white font-semibold text-base flex items-center gap-2">
              <Zap className="h-4 w-4" />Activity
            </SheetTitle>
            <SheetDescription className="sr-only">Activity timeline</SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading...
            </div>
          ) : entries.length === 0 ? (
            <p className="text-[13px] text-slate-400 py-4 text-center">No activity yet</p>
          ) : (
            <div className="flex flex-col">
              {entries.map((entry) => (
                <ActivityEntryRow key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
