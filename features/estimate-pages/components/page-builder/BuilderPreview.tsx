"use client";

import { Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionRenderer } from "../sections/SectionRenderer";
import { ThemeProvider } from "../public/ThemeProvider";
import { TierSelectionProvider } from "../TierSelectionContext";
import type { PageSection, DesignTheme, BrandKit } from "../../types";

interface BuilderPreviewProps {
  sections: PageSection[];
  selectedSectionId: string | null;
  setSelectedSectionId: (id: string | null) => void;
  previewMode: "desktop" | "mobile";
  setPreviewMode: (mode: "desktop" | "mobile") => void;
  designTheme: DesignTheme;
  brandKit: BrandKit | null;
  estimate: {
    estimateNumber: string;
    total: number;
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    lineItems: { description: string; quantity: number; unitPrice: number; total: number }[];
  } | null;
  customer: { name: string; email: string; phone: string } | null;
  pageId: string;
}

export function BuilderPreview({
  sections, selectedSectionId, setSelectedSectionId, previewMode, setPreviewMode,
  designTheme, brandKit, estimate, customer, pageId,
}: BuilderPreviewProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-muted/30">
      <div className="flex items-center justify-center gap-1 border-b py-1.5">
        <Button variant={previewMode === "desktop" ? "secondary" : "ghost"} size="sm" className="h-7 px-2" onClick={() => setPreviewMode("desktop")}>
          <Monitor className="h-3.5 w-3.5" />
        </Button>
        <Button variant={previewMode === "mobile" ? "secondary" : "ghost"} size="sm" className="h-7 px-2" onClick={() => setPreviewMode("mobile")}>
          <Smartphone className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto flex justify-center p-4">
        <ThemeProvider theme={designTheme} brandKit={brandKit}>
          <TierSelectionProvider>
            <div className={`bg-white shadow-sm rounded-lg overflow-hidden ${previewMode === "mobile" ? "w-[375px]" : "w-full max-w-4xl"}`}>
              {sections.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">
                  Add sections to start building
                </div>
              ) : (
                sections.map((s) => (
                  <div
                    key={s.id}
                    className={`relative cursor-pointer transition-shadow ${selectedSectionId === s.id ? "ring-2 ring-blue-500" : "hover:ring-1 hover:ring-blue-300"}`}
                    onClick={() => setSelectedSectionId(s.id)}
                  >
                    <SectionRenderer section={s} brandKit={brandKit} estimate={estimate} customer={customer} pageId={pageId} isPreview />
                  </div>
                ))
              )}
            </div>
          </TierSelectionProvider>
        </ThemeProvider>
      </div>
    </div>
  );
}
