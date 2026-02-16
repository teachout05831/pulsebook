"use client";

import { useState } from "react";
import {
  Image, Shield, Building2, ClipboardList, DollarSign, Images, Camera, Star,
  Video, Calendar, CheckCircle, CreditCard, HelpCircle, Phone,
  MessageSquare, Play, Clock, Plus, Check, Columns, LayoutGrid, Code2,
  List, CalendarDays, ClipboardCheck, Layers, User, Users, Truck, MapPin, FileText,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { SectionType } from "../../types";
import { SECTION_LABELS } from "../../types";

const SECTION_ICONS: Record<SectionType, React.ElementType> = {
  hero: Image, trust_badges: Shield, about: Building2, scope: ClipboardList,
  pricing: DollarSign, gallery: Images, project_photos: Camera, testimonials: Star, video_call: Video,
  calendar: Calendar, approval: CheckCircle, payment: CreditCard, faq: HelpCircle,
  contact: Phone, chat: MessageSquare, video: Play, timeline: Clock,
  before_after: Columns, content_block: LayoutGrid, custom_html: Code2,
  notes: FileText, customer_info: User, crew_details: Truck, addresses: MapPin,
  service_picker: List, scheduler: CalendarDays, booking_form: ClipboardCheck,
};

const ALL_SECTIONS: SectionType[] = [
  "hero", "trust_badges", "about", "scope", "pricing", "gallery", "project_photos",
  "testimonials", "video_call", "calendar", "approval", "payment",
  "faq", "contact", "chat", "video", "timeline", "before_after",
  "content_block", "custom_html", "notes", "customer_info", "crew_details", "addresses",
  "service_picker", "scheduler", "booking_form",
];

interface SectionPickerProps {
  onAddSection: (type: SectionType) => void;
  existingSections: string[];
  allowedTypes?: SectionType[];
  onOpenLibrary?: () => void;
}

export function SectionPicker({ onAddSection, existingSections, allowedTypes, onOpenLibrary }: SectionPickerProps) {
  const [open, setOpen] = useState(false);

  const handleAdd = (type: SectionType) => {
    onAddSection(type);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Add Section
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Section</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-3 max-h-[400px] overflow-y-auto py-2">
          {(allowedTypes || ALL_SECTIONS).map((type) => {
            const Icon = SECTION_ICONS[type];
            const exists = existingSections.includes(type);
            return (
              <button
                key={type}
                onClick={() => handleAdd(type)}
                className="relative flex flex-col items-center gap-2 rounded-lg border p-3 text-sm hover:bg-accent hover:border-primary transition-colors"
              >
                {exists && (
                  <span className="absolute top-1 right-1">
                    <Check className="h-3.5 w-3.5 text-green-600" />
                  </span>
                )}
                <Icon className="h-6 w-6 text-muted-foreground" />
                <span className="text-center text-xs font-medium leading-tight">
                  {SECTION_LABELS[type]}
                </span>
              </button>
            );
          })}
        </div>
        {onOpenLibrary && (
          <>
            <hr className="border-border" />
            <Button variant="outline" className="w-full gap-2" onClick={() => { setOpen(false); onOpenLibrary(); }}>
              <Layers className="h-4 w-4" />
              Browse Universal Blocks
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
