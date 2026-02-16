"use client";

import type { SectionProps } from "./sectionProps";
import { ChecklistView, NarrativeView, DetailedView, RoomChecklistView } from "./ScopeSectionViews";
import type { LineItem } from "./ScopeSectionViews";

type ScopeVariant = "checklist" | "narrative" | "detailed" | "room-checklist";

export function ScopeSection({ section, brandKit, estimate, isPreview }: SectionProps) {
  const hasItems = estimate && estimate.lineItems.length > 0;
  const narrative = (section.content.narrative as string) || null;
  if (!hasItems && !narrative && !isPreview) return null;

  const variant = (section.settings.variant as ScopeVariant) || "checklist";
  const heading = (section.content.title as string) || "Scope of Work";
  const primaryColor = brandKit?.primaryColor || "#2563eb";
  const sampleItems: LineItem[] = [
    { description: "Full demolition and debris removal", quantity: 1, unitPrice: 1200, total: 1200 },
    { description: "Custom cabinetry — shaker style, soft-close", quantity: 12, unitPrice: 700, total: 8400 },
    { description: "Countertops — measured, fabricated, installed", quantity: 1, unitPrice: 4200, total: 4200 },
    { description: "Electrical — outlets, under-cabinet lighting", quantity: 1, unitPrice: 2800, total: 2800 },
    { description: "Plumbing — new sink, faucet, disposal", quantity: 1, unitPrice: 1600, total: 1600 },
    { description: "Tile backsplash installation", quantity: 1, unitPrice: 1400, total: 1400 },
    { description: "LVP flooring — waterproof, scratch-resistant", quantity: 1, unitPrice: 2100, total: 2100 },
    { description: "Final cleanup and walkthrough", quantity: 1, unitPrice: 0, total: 0 },
  ];
  const items = hasItems ? estimate.lineItems : isPreview ? sampleItems : [];

  return (
    <div className="w-full bg-white px-4 ep-animate" style={{ paddingTop: "var(--section-spacing, 3rem)", paddingBottom: "var(--section-spacing, 3rem)" }}>
      <div className="max-w-3xl mx-auto text-center">
        <span className="ep-section-label" style={{ color: primaryColor }}>Scope of Work</span>
        <h2 className="text-xl sm:text-2xl mb-8" style={{ color: primaryColor }}>
          {heading}
        </h2>
        <div className="ep-card-elevated p-5 sm:p-8 text-left">
          {items.length > 0 ? (
            <>
              {variant === "checklist" && <>
                {narrative && <p className="text-sm text-gray-500 text-center mb-6 max-w-xl mx-auto leading-relaxed">{narrative}</p>}
                <ChecklistView items={items} pc={primaryColor} />
              </>}
              {variant === "narrative" && <NarrativeView narrative={narrative} items={items} />}
              {variant === "detailed" && estimate && <DetailedView items={items} estimate={estimate} primaryColor={primaryColor} />}
              {variant === "detailed" && !estimate && <ChecklistView items={items} pc={primaryColor} />}
              {variant === "room-checklist" && <RoomChecklistView items={items} pc={primaryColor} />}
            </>
          ) : narrative ? (
            <NarrativeView narrative={narrative} items={[]} />
          ) : (
            <p className="text-sm text-gray-400 text-center italic">Line items from the estimate will appear here.</p>
          )}
        </div>
      </div>
    </div>
  );
}
