"use client";

import { useState } from "react";
import { Check, Truck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDispatch } from "./dispatch-provider";
import { cn } from "@/lib/utils";

export function CrewFilter() {
  const { crews, filters, updateFilter } = useDispatch();
  const [open, setOpen] = useState(false);

  const selectedCrewIds = filters.crewIds || [];
  const hasSelection = selectedCrewIds.length > 0;

  const toggleCrew = (crewDbId: string) => {
    const next = selectedCrewIds.includes(crewDbId)
      ? selectedCrewIds.filter((id) => id !== crewDbId)
      : [...selectedCrewIds, crewDbId];
    updateFilter("crewIds", next as never);
  };

  const clearFilter = () => updateFilter("crewIds", [] as never);

  if (crews.length === 0) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn("h-8 w-8 relative", hasSelection && "border-blue-500 bg-blue-50 text-blue-700")}
          title={hasSelection ? `${selectedCrewIds.length} Crews filtered` : "Filter Crews"}
        >
          <Truck className="h-4 w-4" />
          {hasSelection && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
              {selectedCrewIds.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[240px] p-0">
        <div className="p-2 border-b">
          <span className="text-xs font-semibold text-gray-500 uppercase">Filter by Crew</span>
        </div>
        <div className="max-h-[280px] overflow-y-auto p-2">
          {crews.map((crew) => {
            const isSelected = selectedCrewIds.includes(crew.databaseId);
            return (
              <button
                key={crew.databaseId}
                onClick={() => toggleCrew(crew.databaseId)}
                className={cn(
                  "w-full flex items-center gap-3 px-2 py-2 rounded-md text-left transition-colors",
                  "hover:bg-gray-100", isSelected && "bg-blue-50",
                )}
              >
                <div className={cn(
                  "h-4 w-4 border rounded flex items-center justify-center flex-shrink-0",
                  isSelected && "bg-blue-600 border-blue-600",
                )}>
                  {isSelected && <Check className="h-3 w-3 text-white" />}
                </div>
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: crew.color }} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{crew.name}</div>
                  <div className="text-xs text-gray-500">{crew.members.length} members</div>
                </div>
              </button>
            );
          })}
        </div>
        {hasSelection && (
          <div className="p-2 border-t">
            <Button variant="ghost" size="sm" className="w-full text-gray-600" onClick={clearFilter}>
              <X className="h-4 w-4 mr-2" />Clear Filter
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
