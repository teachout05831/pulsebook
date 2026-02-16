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

interface PageData {
  id: string;
  sections: PageSection[];
  designTheme: DesignTheme;
  estimate: {
    estimateNumber: string;
    total: number;
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    lineItems: { description: string; quantity: number; unitPrice: number; total: number }[];
  } | null;
  customer: { name: string; email: string; phone: string } | null;
  incentiveConfig: IncentiveConfig | null;
}

interface PageBuilderLoaderProps {
  pageId: string;
}

export function PageBuilderLoader({ pageId }: PageBuilderLoaderProps) {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [brandKit, setBrandKit] = useState<BrandKit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [pageRes, brandRes] = await Promise.all([
          fetch(`/api/estimate-pages/${pageId}`),
          fetch("/api/brand-kit"),
        ]);

        if (!pageRes.ok) {
          setError("Estimate page not found");
          return;
        }

        const pageJson = await pageRes.json();
        setPageData(pageJson.data);

        if (brandRes.ok) {
          const brandJson = await brandRes.json();
          setBrandKit(brandJson.data || null);
        }
      } catch {
        setError("Failed to load page builder");
        toast.error("Failed to load page builder");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [pageId]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <p className="text-sm text-muted-foreground">{error || "Page not found"}</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      <PageBuilder
        pageId={pageData.id}
        initialSections={pageData.sections}
        initialTheme={pageData.designTheme}
        estimate={pageData.estimate}
        customer={pageData.customer}
        initialIncentiveConfig={pageData.incentiveConfig || null}
        brandKit={brandKit}
      />
    </div>
  );
}
