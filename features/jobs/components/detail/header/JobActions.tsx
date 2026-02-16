"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, CalendarDays, Copy, CreditCard, Printer } from "lucide-react";

interface Props {
  onDuplicate: () => void;
  onOpenPanel: (panel: "payments") => void;
  onSchedule: () => void;
}

export function JobActions({ onDuplicate, onOpenPanel, onSchedule }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white h-8 px-3 text-sm font-medium">
          Actions <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onSchedule}>
          <CalendarDays className="mr-2 h-4 w-4" />Schedule Job
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onOpenPanel("payments")}>
          <CreditCard className="mr-2 h-4 w-4" />Take Payment
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />Print
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDuplicate}>
          <Copy className="mr-2 h-4 w-4" />Duplicate
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
