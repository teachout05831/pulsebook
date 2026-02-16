"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { Customer } from "@/types/customer";
import type { Estimate } from "@/types/estimate";
import { useInteractions } from "@/features/interactions/hooks/useInteractions";
import { useSalesTab } from "../hooks/useSalesTab";
import { LeadHeader } from "./LeadHeader";
import { LeadTabs } from "./LeadTabs";
import { LeadQuickStats } from "./LeadQuickStats";
import { FollowUpBanner } from "./FollowUpBanner";
import { ActivityTab } from "./tabs/ActivityTab";
import { SalesTab } from "./tabs/SalesTab";
import { EstimatesTab } from "./tabs/EstimatesTab";
import { NotesTab } from "./tabs/NotesTab";
import { CreateEstimateModal } from "@/features/estimates/components/CreateEstimateModal";
import { CreateFollowUpModal } from "@/features/leads/components/CreateFollowUpModal";
import { ConfirmCompleteDialog } from "@/features/follow-ups/components/ConfirmCompleteDialog";
import { CreateConsultationModal } from "@/features/consultations/components/CreateConsultationModal";
import { InviteCustomerModal } from "@/features/customer-portal/components/InviteCustomerModal";
import type { CustomerTab, LeadTab } from "../types";
import type { InteractionType } from "@/features/interactions/types";

interface LeadProfileViewProps {
  customer: Customer;
  customerId: string;
  from: string | null;
  estimates: Estimate[];
  tabsLoading: Record<string, boolean>;
  loadTabData: (tab: CustomerTab) => (() => void) | void;
  counts: { estimates: number; jobs: number; invoices: number; files: number; notes: number };
  refetchCustomer: () => void;
  refetchEstimates: () => void;
}

export function LeadProfileView({
  customer, customerId, from, estimates, tabsLoading,
  loadTabData, counts, refetchCustomer, refetchEstimates,
}: LeadProfileViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<LeadTab>("activity");
  const [showEstimateModal, setShowEstimateModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [logFormType, setLogFormType] = useState<InteractionType | undefined>();
  const [confirmFollowUpId, setConfirmFollowUpId] = useState<string | null>(null);
  const [showConsultation, setShowConsultation] = useState(false);
  const [showInvitePortal, setShowInvitePortal] = useState(false);

  const { interactions, isLoading: interactionsLoading, refresh: refreshInteractions, handleCreate } = useInteractions(customerId);
  const { followUps, handleStageChange, handleCompleteFollowUp, refreshFollowUps } = useSalesTab(customerId);

  const topFollowUp = followUps.length > 0 ? followUps.sort((a, b) => {
    const urgencyOrder = { overdue: 0, today: 1, upcoming: 2 };
    return (urgencyOrder[a.urgency] ?? 3) - (urgencyOrder[b.urgency] ?? 3);
  })[0] : null;

  const handleTabChange = (tab: LeadTab) => {
    setActiveTab(tab);
    if (tab === "estimates") loadTabData("estimates");
  };

  const handleStage = async (stage: string) => {
    const ok = await handleStageChange(stage as Parameters<typeof handleStageChange>[0]);
    if (ok) refetchCustomer();
  };

  const handleLogActivity = (type: string) => {
    setLogFormType(type as InteractionType);
    setActiveTab("activity");
    setShowLogForm(true);
  };

  const doComplete = async () => {
    if (confirmFollowUpId) { await handleCompleteFollowUp(confirmFollowUpId); setConfirmFollowUpId(null); }
  };

  return (
    <div className="flex flex-col min-h-screen pb-16 sm:pb-0">
      <LeadHeader
        customer={customer}
        from={from}
        onStageChange={handleStage}
        onLogActivity={handleLogActivity}
        onScheduleFollowUp={() => setShowFollowUpModal(true)}
        onCreateEstimate={() => setShowEstimateModal(true)}
        onConsultation={() => setShowConsultation(true)}
        onInvitePortal={() => setShowInvitePortal(true)}
        onEdit={() => router.push(`/customers/${customerId}/edit`)}
      />
      <LeadTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        counts={{ estimates: counts.estimates, notes: counts.notes, interactions: interactions.length }}
      />
      <div className="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50">
        {topFollowUp && (
          <FollowUpBanner followUp={topFollowUp} onComplete={(id: string) => setConfirmFollowUpId(id)} />
        )}
        <LeadQuickStats
          stats={{
            estimatedValue: customer.estimatedValue || 0,
            estimatesCount: counts.estimates,
            lastContact: customer.lastContactDate || null,
            interactionsCount: interactions.length,
          }}
          serviceType={customer.serviceType}
        />

        {activeTab === "activity" && (
          <ActivityTab
            interactions={interactions}
            followUps={followUps}
            onCreateInteraction={handleCreate}
            isLoading={interactionsLoading}
            externalFormType={showLogForm ? logFormType : undefined}
            onExternalFormClear={() => { setShowLogForm(false); setLogFormType(undefined); }}
          />
        )}
        {activeTab === "sales" && (
          <SalesTab customer={customer} customerId={customerId} customerName={customer.name} onRefresh={refetchCustomer} />
        )}
        {activeTab === "estimates" && (
          tabsLoading.estimates ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <EstimatesTab estimates={estimates} customerId={customerId} customerName={customer.name} onRefresh={refetchEstimates} backTo={`lead-profile&customerId=${customerId}`} />
          )
        )}
        {activeTab === "notes" && <NotesTab customerId={customerId} />}
      </div>

      <CreateEstimateModal open={showEstimateModal} onOpenChange={setShowEstimateModal} customerId={customerId} customerName={customer.name} onSuccess={refetchEstimates} />
      <CreateFollowUpModal open={showFollowUpModal} onOpenChange={setShowFollowUpModal} leadId={customerId} leadName={customer.name} onSuccess={refreshFollowUps} />
      <ConfirmCompleteDialog open={!!confirmFollowUpId} onOpenChange={(o) => !o && setConfirmFollowUpId(null)} onConfirm={doComplete} displayName={customer.name} />
      <CreateConsultationModal open={showConsultation} onClose={() => setShowConsultation(false)} customerId={customerId} customerName={customer.name} />
      {customer.email && (
        <InviteCustomerModal open={showInvitePortal} onOpenChange={setShowInvitePortal} customerId={customerId} customerName={customer.name} customerEmail={customer.email} onSuccess={refetchCustomer} />
      )}
    </div>
  );
}
