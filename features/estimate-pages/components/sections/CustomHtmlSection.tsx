"use client";

import { useMemo } from "react";
import DOMPurifyImport from "dompurify";
import type { SectionProps } from "./sectionProps";

// DOMPurify v3 ESM/CJS interop — handle webpack bundling quirks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dp = DOMPurifyImport as any;
const purify: { sanitize: (dirty: string, cfg?: Record<string, unknown>) => string } =
  typeof dp.sanitize === "function"
    ? dp
    : typeof dp.default?.sanitize === "function"
      ? dp.default
      : { sanitize: () => "" };

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);
}

function buildVars(props: SectionProps): Record<string, string> {
  const { customer, estimate, brandKit } = props;
  const v: Record<string, string> = {};
  if (customer) {
    v["customer.name"] = customer.name || "";
    v["customer.email"] = customer.email || "";
    v["customer.phone"] = customer.phone || "";
  }
  if (estimate) {
    v["estimate.number"] = estimate.estimateNumber || "";
    v["estimate.total"] = fmt(estimate.total || 0);
    v["estimate.subtotal"] = fmt(estimate.subtotal || 0);
    v["estimate.taxRate"] = `${estimate.taxRate || 0}%`;
    v["estimate.taxAmount"] = fmt(estimate.taxAmount || 0);
    v["estimate.lineItemCount"] = String(estimate.lineItems?.length || 0);
  }
  if (brandKit) {
    v["brand.primaryColor"] = brandKit.primaryColor || "";
    v["brand.secondaryColor"] = brandKit.secondaryColor || "";
    v["brand.accentColor"] = brandKit.accentColor || "";
    v["brand.tagline"] = brandKit.tagline || "";
    v["brand.description"] = brandKit.companyDescription || "";
    v["brand.googleRating"] = String(brandKit.googleRating || "");
    v["brand.googleReviewCount"] = String(brandKit.googleReviewCount || "");
    v["brand.certifications"] = (brandKit.certifications || []).join(", ");
    v["brand.insurance"] = brandKit.insuranceInfo || "";
    v["brand.logoUrl"] = brandKit.logoUrl || "";
  }
  return v;
}

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\s*[\w.]+\s*)\}\}/g, (_, key: string) => {
    const k = key.trim();
    return k in vars ? vars[k] : `{{${k}}}`;
  });
}

/** Strip anything that could be dangerous in CSS (script injection via expression/url) */
function sanitizeCss(css: string): string {
  return css
    .replace(/expression\s*\(/gi, "/* blocked */")
    .replace(/javascript\s*:/gi, "/* blocked */")
    .replace(/@import\s+url\s*\(\s*["']?javascript:/gi, "/* blocked */");
}

export function CustomHtmlSection(props: SectionProps) {
  const { section } = props;
  const rawHtml = (section.content.html as string) || "";
  const css = (section.content.css as string) || "";
  const scopedId = `custom-html-${section.id}`;

  const vars = useMemo(() => buildVars(props), [props.customer, props.estimate, props.brandKit]);
  const html = useMemo(() => interpolate(rawHtml, vars), [rawHtml, vars]);

  // Replace :scope with the scoped ID and apply CSS-level sanitization
  // CSS is NOT passed through DOMPurify (which destroys CSS syntax).
  // Instead we strip dangerous CSS patterns and rely on the #id scope.
  const scopedCss = useMemo(() => {
    if (!css) return "";
    const replaced = css.replace(/:scope/g, `#${scopedId}`);
    return sanitizeCss(replaced);
  }, [css, scopedId]);

  // Interpolate brand/customer/estimate variables into CSS too
  const finalCss = useMemo(() => interpolate(scopedCss, vars), [scopedCss, vars]);

  if (!rawHtml && !css) {
    return (
      <div className="w-full py-12 text-center text-muted-foreground text-sm">
        <p>Custom HTML section — add your HTML in the editor panel.</p>
      </div>
    );
  }

  return (
    <div id={scopedId} className="w-full ep-animate">
      {finalCss && <style dangerouslySetInnerHTML={{ __html: finalCss }} />}
      <div
        dangerouslySetInnerHTML={{
          __html: purify.sanitize(html, {
            ADD_TAGS: ["details", "summary"],
            ADD_ATTR: ["open"],
          }),
        }}
      />
    </div>
  );
}
