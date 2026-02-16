"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import Link from "next/link";
import type { EstimateDetail } from "@/types/estimate";
import type { TeamMemberOption } from "../../queries/getTeamMemberOptions";

interface Props {
  estimate: EstimateDetail;
  teamMembers: TeamMemberOption[];
  onUpdate: (fields: Record<string, unknown>) => void;
}

const ESTIMATE_SOURCES = [
  { value: "website", label: "Website" },
  { value: "referral", label: "Referral" },
  { value: "google_ads", label: "Google Ads" },
  { value: "phone", label: "Phone" },
  { value: "walk_in", label: "Walk-in" },
  { value: "other", label: "Other" },
];

export function SourceAssignmentCard({ estimate, teamMembers, onUpdate }: Props) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Source & Assignment</CardTitle>
          </div>
          <Link
            href={`/customers/${estimate.customerId}`}
            className="text-xs text-blue-600 hover:underline"
          >
            {estimate.customerName}
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Source</Label>
          <Select value={estimate.source || ""} onValueChange={(v) => onUpdate({ source: v })}>
            <SelectTrigger className="h-9"><SelectValue placeholder="Select source..." /></SelectTrigger>
            <SelectContent>
              {ESTIMATE_SOURCES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Sales Rep</Label>
          <Select value={estimate.salesPersonId || ""} onValueChange={(v) => onUpdate({ salesPersonId: v || null })}>
            <SelectTrigger className="h-9"><SelectValue placeholder="Unassigned" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">Unassigned</SelectItem>
              {teamMembers.map((m) => (
                <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Estimator</Label>
          <Select value={estimate.estimatorId || ""} onValueChange={(v) => onUpdate({ estimatorId: v || null })}>
            <SelectTrigger className="h-9"><SelectValue placeholder="Unassigned" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">Unassigned</SelectItem>
              {teamMembers.map((m) => (
                <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
