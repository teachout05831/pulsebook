"use client";

import { ThemeProvider } from "@/features/estimate-pages/components/public/ThemeProvider";
import { SectionRenderer } from "@/features/estimate-pages/components/sections/SectionRenderer";
import { BookingProvider } from "./BookingProvider";
import type { PublicSchedulingPageData } from "../types";

interface Props {
  data: PublicSchedulingPageData;
  token: string;
}

export function PublicSchedulingPage({ data, token }: Props) {
  const brandKit = data.brandKit
    ? {
        logoUrl: data.brandKit.logoUrl,
        primaryColor: data.brandKit.primaryColor,
        secondaryColor: data.brandKit.secondaryColor || "#1e40af",
        accentColor: data.brandKit.accentColor || "#f59e0b",
        fontFamily: data.brandKit.fontFamily || "Inter, sans-serif",
        headingFont: null,
        companyDescription: null,
        tagline: null,
        companyPhotos: [],
        googleRating: null,
        googleReviewCount: null,
        certifications: [],
        insuranceInfo: null,
        socialLinks: {},
        heroImageUrl: null,
      }
    : null;

  return (
    <BookingProvider token={token} services={data.services}>
      <ThemeProvider theme={data.designTheme} brandKit={brandKit}>
        <div className="min-h-screen bg-gray-50" style={{ fontFamily: "var(--body-font, 'Inter, sans-serif')" }}>
          {data.sections.map((section) => {
            if (!section.visible) return null;
            return (
              <div key={section.id}>
                <SectionRenderer section={section} brandKit={brandKit} estimate={null} customer={null} pageId={data.id} />
              </div>
            );
          })}
          <div className="text-center py-8 text-xs text-muted-foreground"><p>Powered by Pulsebook</p></div>
        </div>
      </ThemeProvider>
    </BookingProvider>
  );
}
