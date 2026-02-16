"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface Props {
  year: number;
  month: number;
  onNavigate: (direction: "prev" | "next") => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function MonthPicker({ year, month, onNavigate }: Props) {
  return (
    <div className="flex items-center justify-center gap-4 py-2">
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onNavigate("prev")}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-2 min-w-[200px] justify-center">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="font-semibold text-lg">{MONTHS[month - 1]} {year}</span>
      </div>
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onNavigate("next")}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
