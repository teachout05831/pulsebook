"use client";

import { useCallback, useState, useEffect } from "react";
import { useEstimateDetail } from "../hooks/useEstimateDetail";
import { useEstimateLocations } from "../hooks/useEstimateLocations";
import { useEstimateNotes } from "../hooks/useEstimateNotes";
import { useEstimatePricing } from "../hooks/useEstimatePricing";
import { EstimateHeader } from "./header/EstimateHeader";
import { HeaderPanels } from "./header/HeaderPanels";
import { EstimateToolbar } from "./header/EstimateToolbar";
import type { EstimateMode } from "./ModeToggle";
import { CustomerPagePreview } from "./preview";
import { SplitViewLayout } from "./SplitViewLayout";
import { QuoteInfoCard } from "./left/QuoteInfoCard";
import { TasksCard } from "./left/TasksCard";
import { StopsCard } from "./center/StopsCard";
import { AddLocationDialog } from "./center/AddLocationDialog";
import { NotesCard } from "./center/NotesCard";
import { ResourcesCard } from "./right/ResourcesCard";
import { EstimateTypeCard } from "./right/EstimateTypeCard";
import { PricingCard } from "./right/PricingCard";
import { HorizontalResourceBar } from "./right/HorizontalResourceBar";
import { CompactQuoteInfo } from "./split/CompactQuoteInfo";
import { CompactStops } from "./split/CompactStops";
import { CompactPricing } from "./split/CompactPricing";
import { CompactCustomerInfo } from "./split/CompactCustomerInfo";
import { CompactEstimateType } from "./split/CompactEstimateType";
import { useEstimatePagePreview } from "../hooks/useEstimatePagePreview";
import { validateEstimate, type ValidationErrors } from "../utils/validateEstimate";
import { PaymentsPanel } from "@/features/payments";
import { DocumentsPanel } from "@/features/documents";
import { ActivityPanel } from "@/features/activity";
import type { EstimateDetail, EstimateLineItem, EstimateResources } from "@/types/estimate";
import type { EstimateResourceField, EstimatePricingCategory, CustomDropdowns, EstimateAssignmentField } from "@/types/company";
import type { TeamMemberOption } from "../queries/getTeamMemberOptions";
import type { CrewOption } from "../queries/getCrewOptions";
import { defaultEstimateBuilderSettings, defaultCustomDropdowns } from "@/types/company";
import type { EstimateTemplate } from "./header/TemplateDropdown";

// Placeholder templates until API is wired up
const PLACEHOLDER_TEMPLATES: EstimateTemplate[] = [
  { id: "professional", name: "Professional", description: "Clean layout with blue accents", color: "#3b82f6" },
  { id: "modern-dark", name: "Modern Dark", description: "Dark theme with bold typography", color: "#1e293b" },
  { id: "minimal", name: "Minimal White", description: "Simple white with subtle borders", color: "#e2e8f0" },
  { id: "premium", name: "Premium Gold", description: "Luxury feel with gold accents", color: "#d97706" },
];

interface Props {
  initialEstimate: EstimateDetail;
  resourceFields: EstimateResourceField[];
  pricingCategories?: EstimatePricingCategory[];
  teamMembers: TeamMemberOption[];
  crews?: CrewOption[];
  dropdowns?: CustomDropdowns;
  assignmentFields?: EstimateAssignmentField[];
}

export function EstimateDetailLayout({ initialEstimate, resourceFields, pricingCategories, teamMembers, crews, dropdowns, assignmentFields }: Props) {
  const { estimate, isSaving, updateField, updateStatus, deleteEstimate, duplicateEstimate, setEstimate } = useEstimateDetail(initialEstimate);
  const { locations, addLocation, removeLocation } = useEstimateLocations(estimate.id, initialEstimate.locations);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [activePanel, setActivePanel] = useState<"docs" | "history" | "activity" | "payments" | null>(null);
  const [mode, setMode] = useState<EstimateMode>("split");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [activeTemplateId, setActiveTemplateId] = useState<string>("professional");
  const { notes, updateNote } = useEstimateNotes(estimate.id, {
    internalNotes: initialEstimate.internalNotes || "", customerNotes: initialEstimate.customerNotes || "",
    crewNotes: initialEstimate.crewNotes || "", crewFeedback: initialEstimate.crewFeedback || "",
  });

  const handleNoteChange = useCallback((key: "internalNotes" | "customerNotes" | "crewNotes" | "crewFeedback", value: string) => {
    updateNote(key, value);
    updateField({ [key]: value });
  }, [updateNote, updateField]);

  const saveLineItems = useCallback(
    async (items: EstimateLineItem[]) => updateField({ lineItems: items }),
    [updateField]
  );

  const { lineItems, addItem, removeItem, updateItem, syncItems } = useEstimatePricing(estimate.id, initialEstimate.lineItems, saveLineItems);

  const handleResourcesUpdate = useCallback((r: EstimateResources) => {
    const isPrimary = (li: EstimateLineItem) => (li.category || "primary_service") === "primary_service";
    if (estimate.pricingModel !== "hourly" || !lineItems.some(isPrimary)) { updateField({ resources: r }); return; }
    const qty = (r.minHours || 0) * (r.teamSize || 1);
    const updated = lineItems.map((li) => isPrimary(li) ? { ...li, quantity: qty, total: qty * li.unitPrice } : li);
    syncItems(updated);
    updateField({ resources: r, lineItems: updated });
  }, [estimate.pricingModel, lineItems, syncItems, updateField]);

  const cats = pricingCategories || defaultEstimateBuilderSettings.pricingCategories;
  const drops = dropdowns || defaultCustomDropdowns;
  const openPayments = () => setActivePanel("payments");

  const pageLink = estimate.estimatePages?.[0] || null;
  const { data: pageData, isLoading: isLoadingPage, toggleSection, addSection, reorderSection } = useEstimatePagePreview(pageLink?.id || null);

  useEffect(() => {
    setValidationErrors(validateEstimate(estimate));
  }, [estimate]);

  return (
    <div>
      {/* Header: 2 compact rows */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-5 py-3">
          <EstimateHeader estimate={estimate} onStatusChange={updateStatus} onDuplicate={duplicateEstimate} onDelete={deleteEstimate} isSaving={isSaving} onOpenPanel={setActivePanel} />
        </div>
      </div>

      {/* Toolbar: sections + template + mode toggle */}
      <div className="max-w-[1600px] mx-auto px-5 py-2 border-b border-slate-100">
        <EstimateToolbar
          mode={mode}
          onModeChange={setMode}
          estimateId={estimate.id}
          sections={pageData?.sections || []}
          onToggleSection={toggleSection}
          onAddSection={addSection}
          onReorderSection={reorderSection}
          templates={PLACEHOLDER_TEMPLATES}
          activeTemplateId={activeTemplateId}
          onSwitchTemplate={setActiveTemplateId}
          hasPage={!!pageData}
        />
      </div>

      {mode === "editor" && (
        <div key="editor" className="max-w-[1600px] mx-auto px-5 py-4 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-4 items-start">
            <div className="space-y-4">
              <QuoteInfoCard estimate={estimate} teamMembers={teamMembers} crews={crews || []} onUpdate={updateField} dropdowns={drops} assignmentFields={assignmentFields} />
              <TasksCard estimateId={estimate.id} initialTasks={initialEstimate.tasks} />
            </div>
            <div className="space-y-4 lg:order-none order-first">
              <StopsCard locations={locations} onAdd={() => setShowAddLocation(true)} onRemove={removeLocation} />
              <NotesCard notes={notes} onNoteChange={handleNoteChange} />
            </div>
            <div className="space-y-4">
              <ResourcesCard resources={estimate.resources} fields={resourceFields} pricingModel={estimate.pricingModel} onUpdate={handleResourcesUpdate} />
              <EstimateTypeCard estimate={estimate} onUpdate={updateField} />
              <PricingCard estimate={estimate} categories={cats} lineItems={lineItems} onAddItem={addItem} onRemoveItem={removeItem} appliedFees={estimate.appliedFees} onUpdateFees={(fees) => updateField({ appliedFees: fees })} onOpenPayments={openPayments} />
            </div>
          </div>
        </div>
      )}

      {mode === "split" && (
        <div key="split" className="max-w-[1600px] mx-auto px-5 py-4 animate-fadeIn">
          <SplitViewLayout estimate={estimate} pageData={pageData} isLoadingPage={isLoadingPage}>
            <div className="space-y-3">
              <HorizontalResourceBar estimate={estimate} resources={estimate.resources || {}} onUpdate={handleResourcesUpdate} errors={{ resources: validationErrors.resources }} />
              <div className="grid grid-cols-2 gap-3 items-start">
                <div className="space-y-3 w-full">
                  <CompactCustomerInfo estimate={estimate} />
                  <CompactQuoteInfo estimate={estimate} onUpdate={updateField} errors={{ serviceType: validationErrors.serviceType, source: validationErrors.source }} />
                </div>
                <div className="space-y-3 w-full">
                  <CompactEstimateType estimate={estimate} onUpdate={updateField} />
                  <CompactStops locations={locations} onAdd={() => setShowAddLocation(true)} onRemove={removeLocation} errors={{ locations: validationErrors.locations }} />
                </div>
              </div>
              <CompactPricing estimate={estimate} lineItems={lineItems} categories={cats} onAddItem={(category) => addItem({ id: crypto.randomUUID(), description: "New Item", quantity: 1, unitPrice: 0, total: 0, category })} onRemoveItem={removeItem} onUpdateItem={updateItem} errors={{ lineItems: validationErrors.lineItems }} />
              <NotesCard notes={notes} onNoteChange={handleNoteChange} />
              <div style={{ maxWidth: "50%" }}>
                <TasksCard estimateId={estimate.id} initialTasks={initialEstimate.tasks} />
              </div>
            </div>
          </SplitViewLayout>
        </div>
      )}

      {mode === "preview" && (
        <div key="preview" className="max-w-[1400px] mx-auto px-5 py-4 animate-fadeIn">
          <CustomerPagePreview estimate={estimate} />
        </div>
      )}

      <AddLocationDialog open={showAddLocation} onClose={() => setShowAddLocation(false)} onAdd={addLocation} />
      <HeaderPanels activePanel={activePanel === "history" ? "history" : null} onClose={() => setActivePanel(null)} estimate={estimate} />
      <PaymentsPanel open={activePanel === "payments"} onClose={() => setActivePanel(null)} entityType="estimate" entityId={estimate.id} total={estimate.total} depositPaid={estimate.depositPaid} onPaymentChange={(paid) => setEstimate((prev) => ({ ...prev, depositPaid: paid }))} />
      <DocumentsPanel open={activePanel === "docs"} onClose={() => setActivePanel(null)} estimateId={estimate.id} jobId={estimate.jobId || undefined} />
      <ActivityPanel open={activePanel === "activity"} onClose={() => setActivePanel(null)} entityType="estimate" entityId={estimate.id} />
    </div>
  );
}
