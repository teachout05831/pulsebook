"use client";

import { ArrowLeft, Phone, Mail, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TagBadge, useTags } from "@/features/tags";
import { LeadHeaderActions } from "./LeadHeaderActions";
import type { Customer, LeadStatus } from "@/types/customer";

const PIPELINE_STAGES: { id: LeadStatus; label: string }[] = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "qualified", label: "Qualified" },
  { id: "proposal", label: "Proposal" },
  { id: "won", label: "Won" },
];

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

interface LeadHeaderProps {
  customer: Customer;
  from?: string | null;
  onStageChange: (stage: LeadStatus) => void;
  onLogActivity: (type: string) => void;
  onScheduleFollowUp: () => void;
  onCreateEstimate: () => void;
  onConsultation: () => void;
  onInvitePortal: () => void;
  onEdit: () => void;
}

export function LeadHeader({
  customer, from, onStageChange, onLogActivity,
  onScheduleFollowUp, onCreateEstimate, onConsultation, onInvitePortal, onEdit,
}: LeadHeaderProps) {
  const router = useRouter();
  const { tags: allTags } = useTags();
  const currentStage = customer.leadStatus || "new";
  const currentIndex = PIPELINE_STAGES.findIndex((s) => s.id === currentStage);

  return (
    <header className="border-b bg-white px-4 md:px-6 lg:px-8 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {from === "my-leads" ? (
            <Button variant="ghost" size="sm" className="shrink-0 mt-0.5 gap-1" onClick={() => router.push("/sales?tab=my-leads")} title="Back to My Leads">
              <ArrowLeft className="h-5 w-5" /><span className="hidden sm:inline text-sm">My Leads</span>
            </Button>
          ) : from === "follow-ups" ? (
            <Button variant="ghost" size="sm" className="shrink-0 mt-0.5 gap-1" onClick={() => router.push("/sales?tab=follow-up")} title="Back to Follow-ups">
              <ArrowLeft className="h-5 w-5" /><span className="hidden sm:inline text-sm">Follow-ups</span>
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="shrink-0 mt-0.5" onClick={() => router.push("/sales?tab=my-leads")} title="Back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-base md:text-lg font-semibold text-white mt-0.5">
            {getInitials(customer.name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg md:text-xl font-semibold truncate">{customer.name}</h1>
              <Badge className="shrink-0 bg-blue-100 text-blue-800">Lead</Badge>
              {customer.tags?.map((tagName) => (
                <TagBadge key={tagName} name={tagName} color={allTags.find((t) => t.name === tagName)?.color || "#6B7280"} />
              ))}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {customer.phone && (
                <a href={`tel:${customer.phone}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                  <Phone className="h-3.5 w-3.5 shrink-0" /><span>{customer.phone}</span>
                </a>
              )}
              {customer.email && (
                <a href={`mailto:${customer.email}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors min-w-0">
                  <Mail className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{customer.email}</span>
                </a>
              )}
              {customer.address && (
                <span className="flex items-center gap-1.5 min-w-0">
                  <MapPin className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{customer.address}</span>
                </span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
              {customer.source && <span><strong className="text-foreground/60">Source:</strong> {customer.source}</span>}
              {customer.assignedTo && <span><strong className="text-foreground/60">Assigned:</strong> {customer.assignedTo}</span>}
              <span><strong className="text-foreground/60">Created:</strong> {new Date(customer.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
          </div>
        </div>
        <LeadHeaderActions
          customerId={customer.id}
          hasEmail={!!customer.email}
          hasPortalAccess={!!customer.userId}
          onLogActivity={onLogActivity}
          onScheduleFollowUp={onScheduleFollowUp}
          onCreateEstimate={onCreateEstimate}
          onConsultation={onConsultation}
          onInvitePortal={onInvitePortal}
          onEdit={onEdit}
        />
      </div>

      {/* Pipeline bar */}
      <div className="mt-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-1.5 min-w-[300px]">
          {PIPELINE_STAGES.map((stage, index) => {
            const isActive = stage.id === currentStage;
            const isPast = index < currentIndex;
            return (
              <button key={stage.id} onClick={() => onStageChange(stage.id)} className="flex-1 group">
                <div className={`h-1.5 rounded-full transition-all ${isActive ? "bg-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.2)]" : isPast ? "bg-blue-500" : "bg-gray-200 group-hover:bg-gray-300"}`} />
                <div className={`text-[11px] text-center mt-1 ${isActive ? "text-blue-700 font-bold" : isPast ? "text-blue-500 font-semibold" : "text-gray-400"}`}>
                  {stage.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
