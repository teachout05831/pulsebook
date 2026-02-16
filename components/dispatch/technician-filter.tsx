"use client";

import { useState } from "react";
import { Check, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDispatch } from "./dispatch-provider";
import { cn } from "@/lib/utils";

export function TechnicianFilter() {
  const {
    technicians,
    selectedTechnicianIds,
    toggleTechnician,
    setSelectedTechnicianIds,
    viewAccess,
  } = useDispatch();
  const [open, setOpen] = useState(false);

  // Only show if company settings allow
  if (!viewAccess.companySettings.showTechnicianFilter) {
    return null;
  }

  const hasSelection = selectedTechnicianIds.length > 0;
  const allSelected = selectedTechnicianIds.length === technicians.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedTechnicianIds([]);
    } else {
      setSelectedTechnicianIds(technicians.map((t) => t.id));
    }
  };

  const handleClearFilter = () => {
    setSelectedTechnicianIds([]);
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "h-8 w-8 relative",
              hasSelection && "border-blue-500 bg-blue-50 text-blue-700"
            )}
            title={hasSelection ? `${selectedTechnicianIds.length} Technicians filtered` : "Filter Technicians"}
          >
            <Users className="h-4 w-4" />
            {hasSelection && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                {selectedTechnicianIds.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[250px] p-0">
          <div className="p-2 border-b">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={handleSelectAll}
            >
              <div
                className={cn(
                  "h-4 w-4 border rounded flex items-center justify-center",
                  allSelected && "bg-blue-600 border-blue-600"
                )}
              >
                {allSelected && <Check className="h-3 w-3 text-white" />}
              </div>
              Select All
            </Button>
          </div>
          <div className="max-h-[300px] overflow-y-auto p-2">
            {technicians.map((tech) => {
              const isSelected = selectedTechnicianIds.includes(tech.id);
              return (
                <button
                  key={tech.id}
                  onClick={() => toggleTechnician(tech.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-2 py-2 rounded-md text-left transition-colors",
                    "hover:bg-gray-100",
                    isSelected && "bg-blue-50"
                  )}
                >
                  <div
                    className={cn(
                      "h-4 w-4 border rounded flex items-center justify-center flex-shrink-0",
                      isSelected && "bg-blue-600 border-blue-600"
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                    style={{ backgroundColor: tech.color }}
                  >
                    {tech.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{tech.name}</div>
                    <div className="text-xs text-gray-500">
                      {tech.todayCompletedCount}/{tech.todayJobCount} jobs
                    </div>
                  </div>
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full flex-shrink-0",
                      tech.isAvailable ? "bg-green-500" : "bg-yellow-500"
                    )}
                  />
                </button>
              );
            })}
          </div>
          {hasSelection && (
            <div className="p-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-gray-600"
                onClick={handleClearFilter}
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filter
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
