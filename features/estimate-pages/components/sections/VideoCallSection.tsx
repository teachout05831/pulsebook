"use client";

import { Video, Phone } from "lucide-react";
import { toast } from "sonner";
import type { SectionProps } from "./sectionProps";

export function VideoCallSection({ section, pageId, isPreview }: SectionProps) {
  const title = (section.content.title as string) || "Schedule a Video Call";
  const description =
    (section.content.description as string) ||
    "Let's walk through the project together on a live video call.";
  const variant = (section.settings.variant as string) || "standard";

  async function handleSchedule() {
    if (isPreview) {
      toast("Video calls available on the live page");
      return;
    }
    if (!pageId) {
      toast("Video call not configured");
      return;
    }
    try {
      const res = await fetch("/api/estimate-pages/video-calls/create-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId, callType: "review" }),
      });
      if (!res.ok) { toast("Unable to create video room"); return; }
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank", "noopener,noreferrer");
      } else {
        toast("Unable to create video room");
      }
    } catch {
      toast("Failed to start video call");
    }
  }

  function handleCallNow() {
    if (isPreview) {
      toast("Video calls available on the live page");
      return;
    }
    if (!pageId) {
      toast("Video call not configured");
      return;
    }
    handleSchedule();
  }

  const buttons = (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={handleSchedule}
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        style={{
          background: "var(--primary-color, #2563eb)",
          borderRadius: "var(--border-radius, 0.5rem)",
        }}
      >
        <Video className="h-4 w-4" />
        Schedule Video Call
      </button>
      <button
        onClick={handleCallNow}
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium border transition-opacity hover:opacity-90"
        style={{
          color: "var(--primary-color, #2563eb)",
          borderColor: "var(--primary-color, #2563eb)",
          borderRadius: "var(--border-radius, 0.5rem)",
        }}
      >
        <Phone className="h-4 w-4" />
        Call Now
      </button>
    </div>
  );

  return (
    <div className="w-full" style={{ padding: "var(--section-spacing, 2.5rem) 1rem" }}>
      <div className="max-w-4xl mx-auto">
        {variant === "split" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="ep-section-label" style={{ color: "var(--primary-color)" }}>Video Call</span>
              <h2
                className="text-xl sm:text-2xl mb-3"
                style={{ color: "var(--primary-color, #1f2937)" }}
              >
                {title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
            <div className="flex md:justify-end">{buttons}</div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <span className="ep-section-label" style={{ color: "var(--primary-color)" }}>Video Call</span>
            <h2
              className="text-xl sm:text-2xl"
              style={{ color: "var(--primary-color, #1f2937)" }}
            >
              {title}
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
            <div className="flex justify-center">{buttons}</div>
          </div>
        )}
      </div>
    </div>
  );
}
