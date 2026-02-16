"use client";

import { MapPin, ArrowRight } from "lucide-react";
import type { SectionProps } from "./sectionProps";

export function AddressesSection({ section, estimate, brandKit, isPreview }: SectionProps) {
  const heading = (section.content.title as string) || "Service Locations";
  const primaryColor = brandKit?.primaryColor || "#2563eb";

  // Get locations from estimate (they would be passed through the estimate prop)
  // For now, we'll need to add locations to the estimate data structure
  // This is a placeholder - the actual implementation will depend on how locations are passed

  return (
    <section className="ep-section">
      <div className="ep-container">
        <h2 className="ep-heading text-center mb-6" style={{ color: primaryColor }}>
          {heading}
        </h2>
        <div className="max-w-3xl mx-auto">
          <div className="ep-card p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Origin */}
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
                      Origin
                    </div>
                    <div className="text-sm text-gray-700">
                      {isPreview ? "3245 E Camelback Rd, Phoenix, AZ 85018" : "Origin address will appear here"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0 hidden sm:block">
                <ArrowRight className="w-6 h-6 text-gray-400" />
              </div>

              {/* Destination */}
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-red-700" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-1">
                      Destination
                    </div>
                    <div className="text-sm text-gray-700">
                      {isPreview ? "1234 N Central Ave, Phoenix, AZ 85004" : "Destination address will appear here"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
