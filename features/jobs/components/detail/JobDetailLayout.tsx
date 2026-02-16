"use client";

import { useCallback, useState } from "react";
import { useJobDetail } from "../../hooks/useJobDetail";
import { useJobPricing } from "../../hooks/useJobPricing";
import { useJobNotes } from "../../hooks/useJobNotes";
import { JobHeader } from "./header/JobHeader";
import { JobInfoCard } from "./left/JobInfoCard";
import { JobEstimateCard } from "./center/JobEstimateCard";
import { JobAddressCard } from "./center/JobAddressCard";
import { JobNotesCard } from "./center/JobNotesCard";
import { JobPhotosCard } from "./center/JobPhotosCard";
import { JobStopsCard } from "./center/JobStopsCard";
import { JobResourcesCard } from "./right/JobResourcesCard";
import { JobTypeCard } from "./right/JobTypeCard";
import { JobPricingCard } from "./right/JobPricingCard";
import { PaymentsPanel } from "@/features/payments";
import { ScheduleModal } from "@/features/scheduling";
import { DocumentsPanel } from "@/features/documents";
import { ActivityPanel } from "@/features/activity";
import { JobPackageCard } from "@/features/prepaid-packages";
import type { JobDetail } from "@/types/job";
import type { EstimateLineItem } from "@/types/estimate";
import type { EstimateResourceField, EstimatePricingCategory } from "@/types/company";
import type { TeamMemberOption } from "@/features/estimates/queries/getTeamMemberOptions";
import type { CrewOption } from "@/features/scheduling/components/ScheduleModal";
import { defaultEstimateBuilderSettings } from "@/types/company";

interface Props {
  initialJob: JobDetail;
  resourceFields: EstimateResourceField[];
  pricingCategories?: EstimatePricingCategory[];
  multiStopRoutesEnabled?: boolean;
  teamMembers: TeamMemberOption[];
  crews?: CrewOption[];
}

export function JobDetailLayout({ initialJob, resourceFields, pricingCategories, multiStopRoutesEnabled = false, teamMembers, crews }: Props) {
  const { job, isSaving, updateField, updateStatus, deleteJob, duplicateJob, setJob } = useJobDetail(initialJob);
  const [activePanel, setActivePanel] = useState<"payments" | "schedule" | "docs" | "activity" | null>(null);

  const handleScheduled = useCallback((data: { scheduledDate: string; scheduledTime: string; assignedTo: string | null; assignedCrewId: string | null }) => {
    setJob((prev) => ({ ...prev, ...data }));
  }, [setJob]);

  const { notes, updateNote } = useJobNotes(job.id, {
    notes: initialJob.notes || "",
    customerNotes: initialJob.customerNotes || "",
    crewNotes: initialJob.crewNotes || "",
    crewFeedback: initialJob.crewFeedback || "",
  });

  const saveLineItems = useCallback(
    async (items: EstimateLineItem[]) => updateField({ lineItems: items }),
    [updateField]
  );

  const { lineItems, addItem, removeItem } = useJobPricing(job.id, initialJob.lineItems, saveLineItems);
  const defaultCategories = defaultEstimateBuilderSettings.pricingCategories;

  return (
    <div>
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-5 py-4">
          <JobHeader job={job} onStatusChange={updateStatus} onDelete={deleteJob} onDuplicate={duplicateJob} isSaving={isSaving} onOpenPanel={setActivePanel} onOpenDocs={() => setActivePanel("docs")} onSchedule={() => setActivePanel("schedule")} />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[230px_1fr_280px] gap-4 items-start">
          <div className="space-y-4">
            <JobInfoCard job={job} teamMembers={teamMembers} crews={crews} onUpdate={updateField} />
          </div>
          <div className="space-y-4 lg:order-none order-first">
            <JobEstimateCard sourceEstimateId={job.sourceEstimateId} />
            {multiStopRoutesEnabled ? (
              <JobStopsCard jobId={job.id} address={job.address} latitude={job.latitude} longitude={job.longitude} onAddressUpdate={(a) => updateField({ address: a })} />
            ) : (
              <JobAddressCard address={job.address} latitude={job.latitude} longitude={job.longitude} onUpdate={(a) => updateField({ address: a })} />
            )}
            <JobNotesCard notes={notes} onNoteChange={updateNote} />
            <JobPhotosCard jobId={job.id} />
          </div>
          <div className="space-y-4">
            <JobResourcesCard resources={job.resources} fields={resourceFields} pricingModel={job.pricingModel} onUpdate={(r) => updateField({ resources: r })} />
            <JobTypeCard job={job} onUpdate={updateField} />
            <JobPackageCard customerId={job.customerId} />
            <JobPricingCard
              job={job}
              categories={pricingCategories || defaultCategories}
              lineItems={lineItems}
              onAddItem={addItem}
              onRemoveItem={removeItem}
              appliedFees={job.appliedFees}
              onUpdateFees={(fees) => updateField({ appliedFees: fees })}
              onOpenPayments={() => setActivePanel("payments")}
            />
          </div>
        </div>
      </div>

      {activePanel === "payments" && (
        <PaymentsPanel open onClose={() => setActivePanel(null)} entityType="job" entityId={job.id} total={job.total} depositPaid={job.depositPaid} onPaymentChange={(paid) => setJob((prev) => ({ ...prev, depositPaid: paid }))} />
      )}
      {activePanel === "schedule" && (
        <ScheduleModal open onClose={() => setActivePanel(null)} jobId={job.id} currentDate={job.scheduledDate} currentTime={job.scheduledTime} currentAssignedTo={job.assignedTo} currentAssignedCrewId={job.assignedCrewId} teamMembers={teamMembers} crews={crews} onScheduled={handleScheduled} />
      )}
      {activePanel === "docs" && (
        <DocumentsPanel open onClose={() => setActivePanel(null)} jobId={job.id} estimateId={job.sourceEstimateId || undefined} />
      )}
      {activePanel === "activity" && (
        <ActivityPanel open onClose={() => setActivePanel(null)} entityType="job" entityId={job.id} />
      )}
    </div>
  );
}
