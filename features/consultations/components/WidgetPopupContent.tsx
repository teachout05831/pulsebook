"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, CheckCircle, ChevronDown } from "lucide-react";
import { SectionRenderer } from "@/features/estimate-pages/components/sections/SectionRenderer";
import { ThemeProvider } from "@/features/estimate-pages/components/public/ThemeProvider";
import { ReviewsContent, PortfolioContent } from "./WidgetPopupBrandContent";
import { VideoLibraryContent } from "./VideoLibraryContent";
import type { CallWidget } from "./CallWidgetBar";
import type { LobbyBrandKit } from "./ConsultationLobby";
import type { DesignTheme } from "@/features/estimate-pages/types";

interface ContentProps {
  widget: CallWidget;
  brandKit: LobbyBrandKit;
  primaryColor: string;
  companyName: string;
}

export function WidgetPopupContent({ widget, brandKit, primaryColor, companyName }: ContentProps) {
  // If widget has builder sections, render them via the page builder renderer
  if (widget.sections && widget.sections.length > 0) {
    return <BuilderContent widget={widget} primaryColor={primaryColor} />;
  }

  if (widget.type === "reviews") return <ReviewsContent brandKit={brandKit} primaryColor={primaryColor} />;
  if (widget.type === "portfolio") return <PortfolioContent brandKit={brandKit} primaryColor={primaryColor} companyName={companyName} />;
  if (widget.type === "process") return <ProcessContent widget={widget} primaryColor={primaryColor} />;
  if (widget.type === "video") return <VideoLibraryContent videoAssetIds={widget.videoAssetIds} showAllLibraryVideos={widget.showAllLibraryVideos} singleVideoUrl={widget.videoUrl} mockAssets={widget.videoAssets} />;
  if (widget.type === "faq") return <FaqContent widget={widget} primaryColor={primaryColor} />;
  if (widget.type === "estimate") return <EstimateContent primaryColor={primaryColor} />;
  if (widget.type === "contract") return <ContractContent primaryColor={primaryColor} />;
  if (widget.type === "custom_link") return <CustomContent widget={widget} />;
  return null;
}

function ProcessContent({ widget, primaryColor }: { widget: CallWidget; primaryColor: string }) {
  const steps = widget.processSteps || [];
  return (
    <div className="space-y-1">
      {steps.map((step, i) => (
        <div key={step.title} className="flex gap-4">
          <div className="flex flex-col items-center shrink-0">
            <div className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: primaryColor }}>{i + 1}</div>
            {i < steps.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: primaryColor + "30" }} />}
          </div>
          <div className="pb-8 flex-1">
            <h4 className="text-white font-semibold text-sm mb-1">{step.title}</h4>
            <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>
            {step.imageUrl && (
              <div className="mt-3 rounded-xl overflow-hidden aspect-[16/9] bg-gray-800 relative">
                <Image src={step.imageUrl} alt={step.title} fill className="object-cover" />
              </div>
            )}
          </div>
        </div>
      ))}
      <div className="flex items-center gap-3 pt-2 pl-1">
        <CheckCircle className="h-8 w-8 shrink-0" style={{ color: primaryColor }} />
        <p className="text-white/60 text-sm font-medium">That&apos;s it! Simple, professional, and hassle-free.</p>
      </div>
    </div>
  );
}

function FaqContent({ widget, primaryColor }: { widget: CallWidget; primaryColor: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = widget.faqs || [];
  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div key={faq.question} className="bg-white/[0.03] rounded-xl border border-white/[0.06] overflow-hidden">
          <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left">
            <span className="text-white/90 text-sm font-medium pr-4">{faq.question}</span>
            <ChevronDown className={`h-4 w-4 text-white/30 shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
          </button>
          {openIndex === i && (
            <div className="px-5 pb-4">
              <div className="h-px mb-3" style={{ backgroundColor: primaryColor + "20" }} />
              <p className="text-white/50 text-sm leading-relaxed">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function EstimateContent({ primaryColor }: { primaryColor: string }) {
  return (
    <div className="text-center py-8">
      <div className="h-16 w-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: primaryColor + "15" }}>
        <Star className="h-8 w-8" style={{ color: primaryColor }} />
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">Estimate Preview</h3>
      <p className="text-white/40 text-sm max-w-sm mx-auto">Your representative will share the estimate when ready. You&apos;ll see it appear here automatically.</p>
    </div>
  );
}

function ContractContent({ primaryColor }: { primaryColor: string }) {
  return (
    <div className="text-center py-8">
      <div className="h-16 w-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: primaryColor + "15" }}>
        <CheckCircle className="h-8 w-8" style={{ color: primaryColor }} />
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">Service Agreement</h3>
      <p className="text-white/40 text-sm max-w-sm mx-auto">Your service contract will appear here. Review terms and sign digitally — right during the consultation.</p>
    </div>
  );
}

function CustomContent({ widget }: { widget: CallWidget }) {
  if (widget.content) {
    return <div className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap">{widget.content}</div>;
  }
  if (widget.url) {
    return (
      <div className="rounded-xl overflow-hidden aspect-video bg-black border border-white/10">
        <iframe src={widget.url} className="w-full h-full" title={widget.label} sandbox="allow-scripts allow-same-origin" />
      </div>
    );
  }
  return <p className="text-white/40 text-sm text-center py-8">No content configured</p>;
}

function BuilderContent({ widget, primaryColor }: { widget: CallWidget; primaryColor: string }) {
  const theme: DesignTheme = widget.designTheme || {};
  const themeKit = {
    primaryColor: primaryColor || "#2563eb",
    secondaryColor: "#1e40af",
    accentColor: "#f59e0b",
    fontFamily: "Inter",
    headingFont: null,
  };

  return (
    <ThemeProvider theme={theme} brandKit={themeKit}>
      <div className="rounded-lg overflow-hidden bg-white">
        {widget.sections!.filter((s) => s.visible).map((section) => (
          <SectionRenderer key={section.id} section={section} brandKit={null} />
        ))}
      </div>
    </ThemeProvider>
  );
}
