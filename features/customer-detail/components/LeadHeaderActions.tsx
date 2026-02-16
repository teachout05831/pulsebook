"use client";

import { Phone, Plus, Calendar, FileText, ChevronDown, User, Video, Globe, Eye, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface LeadHeaderActionsProps {
  customerId: string;
  hasEmail: boolean;
  hasPortalAccess: boolean;
  onLogActivity: (type: string) => void;
  onScheduleFollowUp: () => void;
  onCreateEstimate: () => void;
  onConsultation: () => void;
  onInvitePortal: () => void;
  onEdit: () => void;
}

export function LeadHeaderActions({
  customerId, hasEmail, hasPortalAccess, onLogActivity,
  onScheduleFollowUp, onCreateEstimate, onConsultation, onInvitePortal, onEdit,
}: LeadHeaderActionsProps) {
  const router = useRouter();

  return (
    <>
      {/* Desktop actions */}
      <div className="hidden sm:flex flex-wrap items-center gap-2 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> Log <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onLogActivity("call")}>Phone Call</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onLogActivity("text")}>Text Message</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onLogActivity("email")}>Email</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onLogActivity("meeting")}>Meeting</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onLogActivity("note")}>Note</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="sm" onClick={onScheduleFollowUp}><Calendar className="h-4 w-4 sm:mr-1" /><span className="hidden md:inline">Follow-up</span></Button>
        <Button size="sm" onClick={onCreateEstimate}><FileText className="h-4 w-4 sm:mr-1" /><span className="hidden md:inline">Estimate</span></Button>
        <Button variant="outline" size="sm" onClick={onConsultation}><Video className="h-4 w-4 sm:mr-1" /><span className="hidden md:inline">Consultation</span></Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <MoreHorizontal className="h-4 w-4" /><span className="hidden md:inline">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => window.open(`/customers/${customerId}/portal-preview`, "_blank")}>
              <Eye className="h-4 w-4 mr-2" /> Preview Portal
            </DropdownMenuItem>
            {hasEmail && !hasPortalAccess && (
              <DropdownMenuItem onClick={onInvitePortal}>
                <Globe className="h-4 w-4 mr-2" /> Invite to Portal
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(`/customers/${customerId}?view=full`)}>
              <User className="h-4 w-4 mr-2" /> Full Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile bottom action bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-2 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 gap-1"><Phone className="h-4 w-4" /> Log</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => onLogActivity("call")}>Phone Call</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onLogActivity("text")}>Text Message</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onLogActivity("email")}>Email</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onLogActivity("meeting")}>Meeting</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onLogActivity("note")}>Note</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" className="flex-1" onClick={onConsultation}><Video className="h-4 w-4 mr-1" /> Consult</Button>
          <Button size="sm" className="flex-1" onClick={onCreateEstimate}><FileText className="h-4 w-4 mr-1" /> Estimate</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onScheduleFollowUp}><Calendar className="h-4 w-4 mr-2" /> Follow-up</DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open(`/customers/${customerId}/portal-preview`, "_blank")}><Eye className="h-4 w-4 mr-2" /> Preview Portal</DropdownMenuItem>
              {hasEmail && !hasPortalAccess && (
                <DropdownMenuItem onClick={onInvitePortal}><Globe className="h-4 w-4 mr-2" /> Invite to Portal</DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(`/customers/${customerId}?view=full`)}><User className="h-4 w-4 mr-2" /> Full Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}
