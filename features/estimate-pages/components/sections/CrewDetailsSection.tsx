"use client";

import { Truck, Users, Clock } from "lucide-react";
import type { SectionProps } from "./sectionProps";

export function CrewDetailsSection({ section, estimate, brandKit, isPreview }: SectionProps) {
  const heading = (section.content.title as string) || "Crew Details";
  const primaryColor = brandKit?.primaryColor || "#2563eb";
  const resources = estimate?.resources;

  if (!resources && !isPreview) {
    return null;
  }

  const trucks = resources?.trucks || 0;
  const teamSize = resources?.teamSize || 0;
  const minHours = resources?.minHours || 0;
  const maxHours = resources?.maxHours || 0;
  const estimatedHours = resources?.estimatedHours || 0;
  const pricingModel = estimate?.pricingModel || "flat";

  // Determine hours display
  let hoursDisplay = "Not specified";
  if (pricingModel === "hourly" && (minHours > 0 || maxHours > 0)) {
    hoursDisplay = minHours === maxHours ? `${minHours} hours` : `${minHours}-${maxHours} hours`;
  } else if (estimatedHours > 0) {
    hoursDisplay = `${estimatedHours} hours`;
  }

  return (
    <section className="ep-section bg-gray-50">
      <div className="ep-container">
        <h2 className="ep-heading text-center mb-6" style={{ color: primaryColor }}>
          {heading}
        </h2>
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Trucks */}
            <div className="ep-card p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                  <Truck className="w-6 h-6" style={{ color: primaryColor }} />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{trucks}</div>
              <div className="text-sm text-gray-600 mt-1">Truck{trucks !== 1 ? 's' : ''}</div>
            </div>

            {/* Team Size */}
            <div className="ep-card p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                  <Users className="w-6 h-6" style={{ color: primaryColor }} />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{teamSize}</div>
              <div className="text-sm text-gray-600 mt-1">Team Member{teamSize !== 1 ? 's' : ''}</div>
            </div>

            {/* Hours */}
            <div className="ep-card p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                  <Clock className="w-6 h-6" style={{ color: primaryColor }} />
                </div>
              </div>
              <div className="text-lg font-bold text-gray-900">{hoursDisplay}</div>
              <div className="text-sm text-gray-600 mt-1">Estimated Time</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
