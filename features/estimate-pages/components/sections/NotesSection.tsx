"use client";

import type { SectionProps } from "./sectionProps";

export function NotesSection({ section, estimate, brandKit, isPreview }: SectionProps) {
  const heading = (section.content.title as string) || "Additional Information";
  const notes = estimate?.customerNotes || "";
  const primaryColor = brandKit?.primaryColor || "#2563eb";

  // Don't render if no notes (unless in preview mode where we show placeholder)
  if (!notes && !isPreview) {
    return null;
  }

  return (
    <section className="ep-section">
      <div className="ep-container">
        <h2 className="ep-heading text-center mb-6" style={{ color: primaryColor }}>
          {heading}
        </h2>

        {notes ? (
          <div className="ep-card p-6">
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {notes}
              </p>
            </div>
          </div>
        ) : (
          <div className="ep-card p-6 text-center">
            <p className="text-sm text-gray-400 italic">
              Customer notes will appear here when added
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
