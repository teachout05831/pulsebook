"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import type { EstimateDetail } from "@/types/estimate";

type PanelType = "history";

interface Props {
  activePanel: PanelType | null;
  onClose: () => void;
  estimate: EstimateDetail;
}

export function HeaderPanels({ activePanel, onClose, estimate }: Props) {
  return (
    <Sheet open={activePanel === "history"} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="p-0 w-[380px] sm:max-w-[380px]">
        <div className="bg-slate-800 text-white px-5 py-4 sticky top-0 z-10">
          <SheetHeader>
            <SheetTitle className="text-white font-semibold text-base">Previous Versions</SheetTitle>
            <SheetDescription className="sr-only">Estimate version history</SheetDescription>
          </SheetHeader>
        </div>
        <div className="p-5">
          {estimate.estimatePages && estimate.estimatePages.length > 0 ? (
            estimate.estimatePages.map((page) => (
              <div key={page.id} className="py-2 text-[13px]">
                <div className="font-medium">{estimate.estimateNumber} - Estimate</div>
                <div className="text-[11px] text-slate-400">
                  {page.publishedAt ? `Sent ${new Date(page.publishedAt).toLocaleDateString()}` : "Draft"}
                </div>
              </div>
            ))
          ) : (
            <p className="text-[13px] text-slate-400 py-2">No previous versions</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
