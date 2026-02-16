"use client";

import { User, Mail, Phone } from "lucide-react";
import type { SectionProps } from "./sectionProps";

export function CustomerInfoSection({ section, customer, brandKit, isPreview }: SectionProps) {
  const heading = (section.content.title as string) || "Customer Information";
  const primaryColor = brandKit?.primaryColor || "#2563eb";

  if (!customer && !isPreview) {
    return null;
  }

  return (
    <section className="ep-section">
      <div className="ep-container">
        <h2 className="ep-heading text-center mb-6" style={{ color: primaryColor }}>
          {heading}
        </h2>
        {customer ? (
          <div className="ep-card p-6 max-w-md mx-auto">
            <div className="space-y-3">
              {/* Customer Name */}
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Name</div>
                  <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                </div>
              </div>

              {/* Email */}
              {customer.email && (
                <div className="flex items-center gap-3 pt-2 border-t">
                  <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Email</div>
                    <div className="text-sm text-gray-700">{customer.email}</div>
                  </div>
                </div>
              )}

              {/* Phone */}
              {customer.phone && (
                <div className="flex items-center gap-3 pt-2 border-t">
                  <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Phone</div>
                    <div className="text-sm text-gray-700">{customer.phone}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="ep-card p-6 text-center">
            <p className="text-sm text-gray-400 italic">
              Customer information will appear here
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
