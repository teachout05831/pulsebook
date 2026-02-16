"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { PhotoLightbox } from "./PhotoLightbox";

interface PhotoCarouselProps {
  jobId: string;
  photoUrls?: string[];
}

export function PhotoCarousel({ photoUrls = [] }: PhotoCarouselProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (photoUrls.length === 0) return null;

  return (
    <div className="border-b border-gray-200 bg-gray-50 py-2 overflow-hidden">
      <div className="flex gap-1.5 px-4 overflow-x-auto scrollbar-hide">
        {photoUrls.map((url, i) => (
          <button
            key={url}
            onClick={() => setLightboxIndex(i)}
            className="flex-shrink-0 w-[90px] h-[68px] rounded-md overflow-hidden border-2 border-transparent hover:border-blue-600 transition-all hover:scale-[1.03] relative group"
          >
            <Image
              src={url}
              alt={`Job photo ${i + 1}`}
              width={90}
              height={68}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-4 w-4 text-white" />
            </div>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1 text-[10px] text-gray-400 px-4 pt-1">
        <Camera className="h-3 w-3" />
        <span>{photoUrls.length} photo{photoUrls.length !== 1 ? "s" : ""} — scroll to see more</span>
      </div>
      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={photoUrls}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
