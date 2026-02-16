"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, ZoomIn } from "lucide-react";
import { PhotoLightbox } from "./PhotoLightbox";

interface JobDetailPhotoGridProps {
  photoUrls?: string[];
}

export function JobDetailPhotoGrid({ photoUrls = [] }: JobDetailPhotoGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-900">Job Photos</span>
        <span className="text-xs text-gray-500">
          {photoUrls.length} photo{photoUrls.length !== 1 ? "s" : ""}
        </span>
      </div>

      {photoUrls.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {photoUrls.map((url, i) => (
            <button
              key={url}
              onClick={() => setLightboxIndex(i)}
              className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 relative group transition-all hover:scale-[1.03] hover:shadow-md"
            >
              <Image
                src={url}
                alt={`Job photo ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 120px"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="h-5 w-5 text-white" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 px-5 border-2 border-dashed border-gray-300 rounded-lg text-gray-400">
          <ImageIcon className="h-8 w-8 mb-2" />
          <p className="text-sm">No photos attached to this job</p>
        </div>
      )}

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
