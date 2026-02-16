"use client";

import { X, FileText } from "lucide-react";
import { useLiveEstimate } from "../hooks/useLiveEstimate";
import { LiveEstimateSearch, LiveEstimateLineItems, LiveEstimateTotals, LiveEstimateActions } from "./live-estimate";
import { toast } from "sonner";

interface Props {
  consultationId: string;
  customerId: string | null;
  primaryColor: string;
  onClose: () => void;
  onSaved?: (estimateId: string) => void;
  onPresented?: () => void;
}

export function LiveEstimatePanel({ consultationId, customerId, primaryColor, onClose, onSaved, onPresented }: Props) {
  const est = useLiveEstimate(consultationId, customerId);

  const handleSave = async () => {
    const result = await est.saveEstimate();
    if ("error" in result) { toast.error(result.error); return; }
    toast.success("Estimate saved");
    if (result.estimateId) onSaved?.(result.estimateId);
  };

  const handlePresent = async () => {
    let estimateId = est.savedEstimateId;
    if (!estimateId) {
      const saveResult = await est.saveEstimate();
      if ("error" in saveResult) { toast.error(saveResult.error); return; }
      estimateId = saveResult.estimateId;
      if (estimateId) onSaved?.(estimateId);
    }
    if (!estimateId) return;
    const result = await est.presentToCustomer(estimateId);
    if ("error" in result) { toast.error(result.error); return; }
    toast.success("Estimate presented to customer");
    onPresented?.();
  };

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" style={{ color: primaryColor }} />
          <span className="text-sm font-medium text-white">Live Estimate</span>
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white/70 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        <LiveEstimateSearch services={est.services} materials={est.materials} onAdd={est.addFromCatalog} primaryColor={primaryColor} />
        <LiveEstimateLineItems lineItems={est.lineItems} onUpdate={est.updateItem} onRemove={est.removeItem} primaryColor={primaryColor} />
        <LiveEstimateTotals subtotal={est.totals.subtotal} taxAmount={est.totals.taxAmount} total={est.totals.total} primaryColor={primaryColor} />
        <LiveEstimateActions notes={est.notes} onNotesChange={est.setNotes} onSave={handleSave} onPresent={handlePresent} isSaving={est.isSaving} canPresent={est.lineItems.length > 0} primaryColor={primaryColor} />
      </div>
    </div>
  );
}
