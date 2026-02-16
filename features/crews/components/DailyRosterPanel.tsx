"use client";

import { useEffect } from "react";
import { Check, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDailyRoster } from "../hooks/useDailyRoster";
import type { Crew } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  crews: Crew[];
  date: string;
  onConfirm: () => void;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function DailyRosterPanel({ isOpen, onClose, crews, date, onConfirm }: Props) {
  const { entries, isLoading, fetchRoster, saveRoster, togglePresence } = useDailyRoster(date);

  useEffect(() => {
    if (isOpen) fetchRoster();
  }, [isOpen, fetchRoster]);

  const presentCount = entries.filter((e) => e.isPresent).length;
  const totalCount = entries.length;

  const handleConfirm = async () => {
    await saveRoster(entries);
    onConfirm();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Daily Roster Check-In</SheetTitle>
          <SheetDescription>
            {presentCount} of {totalCount} members checked in for today
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4 overflow-y-auto max-h-[calc(100vh-220px)]">
          {crews.map((crew) => {
            const crewEntries = entries.filter((e) => e.crewId === crew.id);
            const crewPresent = crewEntries.filter((e) => e.isPresent).length;

            return (
              <div key={crew.id} className="border rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 p-3 border-b bg-muted/30">
                  <div className="w-1 h-9 rounded" style={{ backgroundColor: crew.color }} />
                  <span className="font-semibold flex-1">{crew.name}</span>
                  {crew.vehicleName && (
                    <span className="text-xs text-muted-foreground">&#x1f69a; {crew.vehicleName}</span>
                  )}
                  <span className="text-xs bg-muted px-2 py-0.5 rounded">
                    {crewPresent}/{crewEntries.length}
                  </span>
                </div>
                <div className="p-2">
                  {crewEntries.map((entry) => (
                    <div
                      key={entry.teamMemberId}
                      className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-opacity ${
                        entry.isPresent ? "opacity-100" : "opacity-40 line-through"
                      }`}
                      onClick={() => togglePresence(entry.teamMemberId)}
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs ${
                          entry.isPresent
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "border-gray-300"
                        }`}
                      >
                        {entry.isPresent && <Check className="h-3 w-3" />}
                      </div>
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                        style={{ backgroundColor: crew.color }}
                      >
                        {getInitials(entry.memberName)}
                      </div>
                      <span className="text-sm flex-1">{entry.memberName}</span>
                      {entry.isFillIn && (
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                          Fill-in
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <SheetFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            Confirm &amp; Go to Dispatch
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
