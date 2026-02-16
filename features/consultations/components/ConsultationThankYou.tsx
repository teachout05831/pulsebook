"use client";

import Image from "next/image";
import { CheckCircle, Star, ArrowRight } from "lucide-react";

interface ConsultationThankYouProps {
  companyName: string;
  logoUrl: string | null;
  primaryColor: string;
  durationSeconds: number;
  purpose: string | null;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return "Less than a minute";
  const minutes = Math.floor(seconds / 60);
  return minutes === 1 ? "1 minute" : `${minutes} minutes`;
}

export function ConsultationThankYou({
  companyName,
  logoUrl,
  primaryColor,
  durationSeconds,
  purpose,
}: ConsultationThankYouProps) {
  const nextSteps =
    purpose === "estimate_review"
      ? [
          { title: "Review complete", desc: "We hope the walkthrough was helpful" },
          { title: "Questions?", desc: "Reply to your estimate link anytime" },
          { title: "Ready to go?", desc: "Approve your estimate to get started" },
        ]
      : [
          { title: "Estimate on the way", desc: "We're preparing your personalized quote" },
          { title: "Check your inbox", desc: "You'll receive it via email shortly" },
          { title: "Questions?", desc: "Reach out anytime - we're here to help" },
        ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px] opacity-15"
        style={{ background: primaryColor }}
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          {/* Company branding */}
          <div className="flex justify-center mb-10">
            {logoUrl ? (
              <Image src={logoUrl} alt={companyName} width={200} height={40} className="h-10 w-auto object-contain" />
            ) : (
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  {companyName.charAt(0)}
                </div>
                <span className="text-white/90 font-semibold">{companyName}</span>
              </div>
            )}
          </div>

          {/* Success animation */}
          <div className="text-center mb-10">
            <div
              className="h-20 w-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ backgroundColor: primaryColor + "15" }}
            >
              <CheckCircle className="h-10 w-10" style={{ color: primaryColor }} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Great talking with you!
            </h1>
            <p className="text-white/50 text-lg">
              Your consultation with {companyName} is complete
            </p>
            {durationSeconds > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <span className="text-white/40 text-sm">Duration: {formatDuration(durationSeconds)}</span>
              </div>
            )}
          </div>

          {/* Next steps card */}
          <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-white/5">
              <h3 className="text-white font-medium flex items-center gap-2">
                <ArrowRight className="h-4 w-4" style={{ color: primaryColor }} />
                What happens next
              </h3>
            </div>
            <div className="divide-y divide-white/5">
              {nextSteps.map((step, i) => (
                <div key={step.title} className="flex items-start gap-4 px-6 py-4">
                  <div
                    className="h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-white/90 font-medium text-sm">{step.title}</p>
                    <p className="text-white/40 text-sm mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rating prompt */}
          <div className="text-center bg-white/[0.03] rounded-2xl border border-white/10 px-6 py-5">
            <p className="text-white/50 text-sm mb-3">How was your experience?</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className="h-10 w-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  <Star className="h-5 w-5 text-white/30 hover:text-yellow-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <span className="text-white/15 text-xs">Powered by ServicePro</span>
          </div>
        </div>
      </div>
    </div>
  );
}
