"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { SCHEDULING_SECTION_TYPES } from "@/features/estimate-pages/types";
import type { PageSection, DesignTheme, BrandKit } from "@/features/estimate-pages/types";
import { toast } from "sonner";

const PageBuilder = dynamic(
  () => import("@/features/estimate-pages/components/page-builder/PageBuilder").then((mod) => ({ default: mod.PageBuilder })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    ),
  }
);

interface SchedulingBuilderClientProps {
  pageId: string;
  initialSections: PageSection[];
  initialTheme: DesignTheme;
  brandKit: BrandKit | null;
}

export function SchedulingBuilderClient({
  pageId,
  initialSections,
  initialTheme,
  brandKit,
}: SchedulingBuilderClientProps) {
  const [key, setKey] = useState(0);

  const handleTemplateLoad = async (data: { sections: PageSection[]; designTheme: DesignTheme }) => {
    const res = await fetch(`/api/scheduling/${pageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sections: data.sections, designTheme: data.designTheme }),
    });

    if (!res.ok) {
      toast.error("Failed to load template");
      return;
    }

    setKey((k) => k + 1);
    toast.success("Template loaded successfully");
  };

  return (
    <PageBuilder
      key={key}
      pageId={pageId}
      initialSections={initialSections}
      initialTheme={initialTheme}
      initialIncentiveConfig={null}
      estimate={null}
      customer={null}
      brandKit={brandKit}
      mode="scheduling"
      saveEndpoint={`/api/scheduling/${pageId}`}
      allowedSectionTypes={SCHEDULING_SECTION_TYPES}
      backHref="/scheduling"
      onTemplateLoad={handleTemplateLoad}
    />
  );
}
