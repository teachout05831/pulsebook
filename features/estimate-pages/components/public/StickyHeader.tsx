"use client";

import { useState, useEffect, useCallback } from "react";

interface StickyHeaderProps {
  brandKit: {
    logoUrl: string | null;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    tagline: string | null;
  } | null;
  phone?: string;
  estimateNumber?: string;
  onApproveClick?: () => void;
  isPreview?: boolean;
}

const SCROLL_THRESHOLD = 100;

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export function StickyHeader({
  brandKit, phone, estimateNumber, onApproveClick, isPreview = false,
}: StickyHeaderProps) {
  const [visible, setVisible] = useState(false);
  const primaryColor = brandKit?.primaryColor || "#2563eb";

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleApproveClick = useCallback(() => {
    if (onApproveClick) { onApproveClick(); return; }
    document.querySelector('[data-section-type="approval"]')
      ?.scrollIntoView({ behavior: "smooth" });
  }, [onApproveClick]);

  return (
    <header
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease",
        backgroundColor: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{
        maxWidth: "1200px", margin: "0 auto", padding: "0.625rem 1.25rem",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem",
      }}>
        {/* Logo / company mark */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
          {brandKit?.logoUrl ? (
            <img
              src={brandKit.logoUrl}
              alt="Company logo"
              style={{ height: "36px", width: "auto", maxWidth: "160px", objectFit: "contain" }}
            />
          ) : (
            <div style={{
              width: "36px", height: "36px", borderRadius: "8px",
              backgroundColor: primaryColor,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: "16px",
            }}>
              {estimateNumber ? "#" : "S"}
            </div>
          )}
        </div>

        {/* Phone -- hidden on small screens via Tailwind */}
        {phone && (
          <a
            href={isPreview ? undefined : `tel:${phone}`}
            onClick={isPreview ? (e) => e.preventDefault() : undefined}
            className="hidden sm:flex"
            style={{
              alignItems: "center", gap: "0.375rem",
              color: "#374151", textDecoration: "none",
              fontSize: "0.875rem", fontWeight: 500, whiteSpace: "nowrap",
            }}
          >
            <PhoneIcon />
            {phone}
          </a>
        )}

        {/* CTA button */}
        <button
          onClick={handleApproveClick}
          style={{
            flexShrink: 0, padding: "0.5rem 1.25rem", borderRadius: "0.5rem",
            border: "none", backgroundColor: primaryColor, color: "#fff",
            fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
            transition: "opacity 0.2s ease, transform 0.15s ease",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9";
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Approve Estimate
        </button>
      </div>
    </header>
  );
}
