"use client";

import { Play } from "lucide-react";
import { VideoPlayer } from "@/features/media/components/VideoPlayer";
import type { SectionProps } from "./sectionProps";

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function isBunnyVideo(url: string): boolean {
  return url.includes("bunny.net") || url.includes("mediadelivery.net") || url.includes("b-cdn.net");
}

export function VideoSection({ section }: SectionProps) {
  const title = (section.content.title as string) || "Watch Our Video";
  const videoUrl = (section.content.videoUrl as string) || "";
  const thumbnailUrl = (section.content.thumbnailUrl as string) || "";
  const description = (section.content.description as string) || "";
  const variant = (section.settings.variant as string) || "standard";

  const isYouTube = videoUrl.includes("youtube") || videoUrl.includes("youtu.be");
  const youtubeId = isYouTube ? getYouTubeId(videoUrl) : null;

  const videoElement = videoUrl ? (
    isYouTube && youtubeId ? (
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="w-full aspect-video"
        style={{ borderRadius: "var(--border-radius, 0.5rem)" }}
      />
    ) : isBunnyVideo(videoUrl) ? (
      <VideoPlayer src={videoUrl} thumbnailUrl={thumbnailUrl || undefined} title={title} />
    ) : (
      <video
        src={videoUrl}
        controls
        poster={thumbnailUrl || undefined}
        className="w-full aspect-video bg-black"
        style={{ borderRadius: "var(--border-radius, 0.5rem)" }}
      />
    )
  ) : (
    <Placeholder />
  );

  return (
    <div className="w-full" style={{ padding: "var(--section-spacing, 2.5rem) 1rem" }}>
      <div className={variant === "fullwidth" ? "w-full" : "max-w-4xl mx-auto"}>
        {variant === "side-by-side" ? (
          <SideBySideLayout title={title} description={description} video={videoElement} />
        ) : (
          <StackedLayout title={title} description={description} video={videoElement} />
        )}
      </div>
    </div>
  );
}

function StackedLayout({
  title,
  description,
  video,
}: {
  title: string;
  description: string;
  video: React.ReactNode;
}) {
  return (
    <>
      <div className="text-center mb-6">
        <span className="ep-section-label" style={{ color: "var(--primary-color)" }}>Video</span>
        <h2 className="text-xl sm:text-2xl" style={{ color: "var(--primary-color, #1f2937)" }}>
          {title}
        </h2>
      </div>
      {video}
      {description && (
        <p className="text-sm text-muted-foreground mt-4 text-center max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </>
  );
}

function SideBySideLayout({
  title,
  description,
  video,
}: {
  title: string;
  description: string;
  video: React.ReactNode;
}) {
  return (
    <>
      <div className="text-center mb-6">
        <span className="ep-section-label" style={{ color: "var(--primary-color)" }}>Video</span>
        <h2 className="text-xl sm:text-2xl" style={{ color: "var(--primary-color, #1f2937)" }}>
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>{video}</div>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        )}
      </div>
    </>
  );
}

function Placeholder() {
  return (
    <div
      className="w-full aspect-video flex flex-col items-center justify-center gap-3 relative overflow-hidden"
      style={{ borderRadius: "var(--border-radius, 0.5rem)", background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}
    >
      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
        <Play className="h-7 w-7 text-white/70 ml-0.5" />
      </div>
      <p className="text-sm text-white/40">Add a video URL in the editor</p>
    </div>
  );
}
