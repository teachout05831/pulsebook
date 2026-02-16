"use client";

interface ConsultationBrandingProps {
  companyName: string;
  logoUrl: string | null;
  primaryColor: string;
  size?: "sm" | "lg";
}

export function ConsultationBranding({
  companyName,
  logoUrl,
  primaryColor,
  size = "lg",
}: ConsultationBrandingProps) {
  const logoSize = size === "lg" ? "h-14 w-14" : "h-8 w-8";
  const nameSize = size === "lg" ? "text-xl font-semibold" : "text-sm font-medium";

  return (
    <div className="flex items-center gap-3">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={companyName}
          className={`${logoSize} object-contain rounded-lg`}
        />
      ) : (
        <div
          className={`${logoSize} rounded-lg flex items-center justify-center text-white font-bold ${
            size === "lg" ? "text-xl" : "text-xs"
          }`}
          style={{ backgroundColor: primaryColor }}
        >
          {companyName.charAt(0)}
        </div>
      )}
      <div>
        <h1 className={`${nameSize} text-white`}>{companyName}</h1>
        {size === "lg" && (
          <div className="h-0.5 w-12 mt-1 rounded-full" style={{ backgroundColor: primaryColor }} />
        )}
      </div>
    </div>
  );
}
