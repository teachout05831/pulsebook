"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { PageSection, DesignTheme, BrandKit, IncentiveConfig } from "../../types";

const PageBuilder = dynamic(() => import("./PageBuilder").then((mod) => ({ default: mod.PageBuilder })), {
  ssr: false,
  loading: () => (
    <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
    </div>
  ),
});

interface TemplateData {
  id: string;
  sections: PageSection[];
  designTheme: DesignTheme;
  incentiveConfig: IncentiveConfig | null;
}

interface TemplateBuilderLoaderProps {
  templateId: string;
}

export function TemplateBuilderLoader({ templateId }: TemplateBuilderLoaderProps) {
  const [templateData, setTemplateData] = useState<TemplateData | null>(null);
  const [brandKit, setBrandKit] = useState<BrandKit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [tplRes, brandRes] = await Promise.all([
          fetch(`/api/estimate-pages/templates/${templateId}`),
          fetch("/api/brand-kit"),
        ]);

        if (!tplRes.ok) {
          setError("Template not found");
          return;
        }

        const tplJson = await tplRes.json();
        setTemplateData(tplJson.data);

        if (brandRes.ok) {
          const brandJson = await brandRes.json();
          setBrandKit(brandJson.data || null);
        }
      } catch {
        setError("Failed to load template builder");
        toast.error("Failed to load template builder");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [templateId]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !templateData) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <p className="text-sm text-muted-foreground">{error || "Template not found"}</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      <PageBuilder
        pageId={templateData.id}
        initialSections={templateData.sections}
        initialTheme={templateData.designTheme}
        initialIncentiveConfig={templateData.incentiveConfig}
        estimate={null}
        customer={null}
        brandKit={brandKit}
        mode="template"
        saveEndpoint={`/api/estimate-pages/templates/${templateId}`}
      />
    </div>
  );
}
