"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, Calendar } from "lucide-react";
import { CustomerPackagesCard } from "@/features/prepaid-packages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSalesTab } from "../../hooks/useSalesTab";
import { defaultCustomDropdowns } from "@/types/company";
import { CreateEstimateModal } from "@/features/estimates/components/CreateEstimateModal";
import { CreateFollowUpModal } from "@/features/leads/components/CreateFollowUpModal";
import { ConfirmCompleteDialog } from "@/features/follow-ups/components/ConfirmCompleteDialog";
import { parseFollowUpDueDate } from "@/features/follow-ups/types";
import type { Customer, LeadStatus } from "@/types/customer";

interface SalesTabProps {
  customer: Customer;
  customerId: string;
  customerName: string;
  onRefresh: () => void;
}

const PIPELINE_STAGES: { id: LeadStatus; label: string }[] = [
  { id: "new", label: "Lead" },
  { id: "contacted", label: "Contacted" },
  { id: "qualified", label: "Qualified" },
  { id: "proposal", label: "Proposal" },
  { id: "won", label: "Won" },
];

const FOLLOW_UP_ICONS = { call: Phone, email: Mail, meeting: MapPin };
const URGENCY_STYLES = {
  overdue: "bg-red-100 text-red-700",
  today: "bg-amber-100 text-amber-700",
  upcoming: "bg-blue-100 text-blue-700",
};

export function SalesTab({ customer, customerId, customerName, onRefresh }: SalesTabProps) {
  const [showEstimateModal, setShowEstimateModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [confirmFollowUpId, setConfirmFollowUpId] = useState<string | null>(null);
  const { followUps, handleStageChange, handleSourceChange, handleCompleteFollowUp, refreshFollowUps } = useSalesTab(customerId);

  const currentStage = customer.leadStatus || "new";
  const daysInPipeline = Math.max(0, Math.floor((Date.now() - new Date(customer.createdAt).getTime()) / 86400000));

  const onStageClick = async (stage: LeadStatus) => {
    if (stage === currentStage) return;
    const ok = await handleStageChange(stage);
    if (ok) onRefresh();
  };

  const onSourceSelect = async (value: string) => {
    const ok = await handleSourceChange(value);
    if (ok) onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Sales Pipeline</h2>
          <p className="text-sm text-muted-foreground">Track customer journey and opportunities</p>
        </div>
        <Button className="w-full sm:w-auto" onClick={() => setShowEstimateModal(true)}>+ Add Estimate</Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Pipeline Stage</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {PIPELINE_STAGES.map((stage, index) => {
              const isActive = stage.id === currentStage;
              const isPast = PIPELINE_STAGES.findIndex((s) => s.id === currentStage) > index;
              return (
                <button key={stage.id} onClick={() => onStageClick(stage.id)} className={`flex-1 min-w-[80px] rounded-lg border-2 p-3 text-center transition-colors cursor-pointer ${isActive ? "border-blue-500 bg-blue-50" : isPast ? "border-green-300 bg-green-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"}`}>
                  <div className={`text-sm font-medium ${isActive ? "text-blue-700" : isPast ? "text-green-700" : "text-gray-500"}`}>{stage.label}</div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground mb-1">Lead Source</div>
            <Select value={customer.source || ""} onValueChange={onSourceSelect}>
              <SelectTrigger className="h-9"><SelectValue placeholder="Select source" /></SelectTrigger>
              <SelectContent>
                {defaultCustomDropdowns.sources.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Days in Pipeline</div>
            <div className="text-lg font-bold">{daysInPipeline} {daysInPipeline === 1 ? "day" : "days"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Potential Value</div>
            <div className="text-lg font-bold text-green-600">{customer.estimatedValue ? `$${customer.estimatedValue.toLocaleString()}` : "—"}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Follow-up Tasks</CardTitle>
          <Button size="sm" variant="outline" onClick={() => setShowFollowUpModal(true)}>Add Follow-up</Button>
        </CardHeader>
        <CardContent>
          {followUps.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">No pending follow-ups</p>
          ) : (
            <div className="space-y-3">
              {followUps.map((fu) => {
                const Icon = FOLLOW_UP_ICONS[fu.type] || Calendar;
                return (
                  <div key={fu.id} className="flex items-center gap-3 rounded-lg border p-3">
                    <input type="checkbox" className="h-4 w-4 rounded cursor-pointer" checked={false} onChange={() => setConfirmFollowUpId(fu.id)} />
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium capitalize">{fu.type}{fu.details ? `: ${fu.details}` : ""}</div>
                      <div className="text-sm text-muted-foreground">Due: {(() => { const p = parseFollowUpDueDate(fu.dueDate); return p.displayTime ? `${p.displayDate} at ${p.displayTime}` : p.displayDate; })()}</div>
                    </div>
                    <Badge variant="outline" className={URGENCY_STYLES[fu.urgency]}>{fu.urgency === "overdue" ? `${fu.daysOverdue}d overdue` : fu.urgency === "today" ? "Due today" : "Upcoming"}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <CustomerPackagesCard customerId={customerId} customerName={customerName} />
      <CreateEstimateModal open={showEstimateModal} onOpenChange={setShowEstimateModal} customerId={customerId} customerName={customerName} onSuccess={onRefresh} />
      <CreateFollowUpModal open={showFollowUpModal} onOpenChange={setShowFollowUpModal} leadId={customerId} leadName={customerName} onSuccess={refreshFollowUps} />
      <ConfirmCompleteDialog open={!!confirmFollowUpId} onOpenChange={(o) => !o && setConfirmFollowUpId(null)} onConfirm={() => { if (confirmFollowUpId) { handleCompleteFollowUp(confirmFollowUpId); setConfirmFollowUpId(null); } }} displayName={customerName} />
    </div>
  );
}
