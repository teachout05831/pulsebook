"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TagSelector } from "@/features/tags";
import type { EstimateDetail } from "@/types/estimate";
import type { CustomDropdowns, EstimateAssignmentField } from "@/types/company";
import type { TeamMemberOption } from "../../queries/getTeamMemberOptions";
import type { CrewOption } from "../../queries/getCrewOptions";

const DEFAULT_ASSIGNMENTS: EstimateAssignmentField[] = [
  { key: "salesPerson", label: "Sales Rep", enabled: true },
  { key: "estimator", label: "Estimator", enabled: true },
  { key: "crew", label: "Crew", enabled: true },
  { key: "technician", label: "Technician", enabled: true },
];

interface Props {
  estimate: EstimateDetail;
  teamMembers: TeamMemberOption[];
  crews: CrewOption[];
  onUpdate: (fields: Record<string, unknown>) => void;
  dropdowns: CustomDropdowns;
  assignmentFields?: EstimateAssignmentField[];
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1 text-[13px]">
      <span className="text-slate-500 font-medium">{label}</span>
      {children}
    </div>
  );
}

const NONE = "__none__";

function CompactSelect({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string;
}) {
  const safeValue = value || NONE;
  const safeOptions = options.map((o) => ({ value: o.value || NONE, label: o.label }));
  return (
    <Select value={safeValue} onValueChange={(v) => onChange(v === NONE ? "" : v)}>
      <SelectTrigger className="h-auto border-0 bg-transparent p-0 text-blue-600 font-medium text-[13px] text-right shadow-none w-auto min-w-0 gap-1 [&>svg]:h-3 [&>svg]:w-3">
        <SelectValue placeholder={placeholder || "Select..."} />
      </SelectTrigger>
      <SelectContent>
        {safeOptions.map((o) => (
          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function QuoteInfoCard({ estimate, teamMembers, crews, onUpdate, dropdowns, assignmentFields }: Props) {
  const [tagsOpen, setTagsOpen] = useState(false);
  const teamOptions = [{ value: "", label: "Unassigned" }, ...teamMembers.map((m) => ({ value: m.id, label: m.name }))];
  const crewOptions = [{ value: "", label: "Unassigned" }, ...crews.map((c) => ({ value: c.id, label: c.name }))];
  const fields = assignmentFields || DEFAULT_ASSIGNMENTS;
  const isOn = (key: string) => fields.find((f) => f.key === key)?.enabled ?? true;
  const label = (key: string) => fields.find((f) => f.key === key)?.label || key;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px] font-semibold">Quote Info</span>
        </div>

        <FieldRow label="Number">
          <span className="font-semibold">{estimate.estimateNumber}</span>
        </FieldRow>
        <FieldRow label="Type">
          <CompactSelect value={estimate.serviceType || ""} onChange={(v) => onUpdate({ serviceType: v })} options={dropdowns.serviceTypes} />
        </FieldRow>
        <FieldRow label="Source">
          <CompactSelect value={estimate.source || ""} onChange={(v) => onUpdate({ source: v })} options={dropdowns.sources} />
        </FieldRow>

        {isOn("salesPerson") && (
          <FieldRow label={label("salesPerson")}>
            <CompactSelect value={estimate.salesPersonId || ""} onChange={(v) => onUpdate({ salesPersonId: v || null })} options={teamOptions} placeholder="Unassigned" />
          </FieldRow>
        )}
        {isOn("estimator") && (
          <FieldRow label={label("estimator")}>
            <CompactSelect value={estimate.estimatorId || ""} onChange={(v) => onUpdate({ estimatorId: v || null })} options={teamOptions} placeholder="Unassigned" />
          </FieldRow>
        )}
        {isOn("crew") && (
          <FieldRow label={label("crew")}>
            <CompactSelect value={estimate.assignedCrewId || ""} onChange={(v) => onUpdate({ assignedCrewId: v || null })} options={crewOptions} placeholder="Unassigned" />
          </FieldRow>
        )}
        {isOn("technician") && (
          <FieldRow label={label("technician")}>
            <CompactSelect value={estimate.technicianId || ""} onChange={(v) => onUpdate({ technicianId: v || null })} options={teamOptions} placeholder="Unassigned" />
          </FieldRow>
        )}

        <FieldRow label="Tags">
          <Popover open={tagsOpen} onOpenChange={setTagsOpen}>
            <PopoverTrigger asChild>
              <button className="text-blue-600 font-medium text-[13px] hover:underline">
                {estimate.tags?.length ? `${estimate.tags.length} tags` : "+"}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3" align="end">
              <TagSelector selectedTags={estimate.tags || []} onChange={(tags) => onUpdate({ tags })} entityType="estimate" />
            </PopoverContent>
          </Popover>
        </FieldRow>

        <FieldRow label="Lead Status">
          <CompactSelect value={estimate.leadStatus || ""} onChange={(v) => onUpdate({ leadStatus: v })} options={[{ value: "", label: "None" }, ...dropdowns.leadStatuses]} placeholder="None" />
        </FieldRow>
      </CardContent>
    </Card>
  );
}
