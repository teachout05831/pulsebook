"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, X, ArrowRight } from "lucide-react";
import type { SectionProps } from "./sectionProps";

interface Photo {
  url: string;
  caption?: string;
  isBefore?: boolean;
  isAfter?: boolean;
}

function Lightbox({ photo, onClose }: { photo: Photo; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300 z-10" aria-label="Close lightbox">
        <X className="w-8 h-8" />
      </button>
      <div className="max-w-4xl max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <Image src={photo.url} alt={photo.caption || "Gallery photo"} width={800} height={600} className="max-h-[80vh] w-auto object-contain" style={{ borderRadius: "var(--border-radius)" }} />
        {photo.caption && <p className="text-white text-center mt-3 text-sm">{photo.caption}</p>}
      </div>
    </div>
  );
}

function PlaceholderGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-gray-100 flex flex-col items-center justify-center aspect-[4/3]"
          style={{ borderRadius: "var(--border-radius)" }}
        >
          <Camera className="w-10 h-10 text-gray-300" />
          <p className="text-gray-400 text-xs mt-2">No photos yet</p>
        </div>
      ))}
    </div>
  );
}

function BeforeAfterPair({ before, after, onClickBefore, onClickAfter }: {
  before: Photo; after: Photo; onClickBefore: () => void; onClickAfter: () => void;
}) {
  return (
    <div className="col-span-full">
      <div className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-2">
        <span>Before</span><ArrowRight className="w-3 h-3" /><span>After</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[{ photo: before, onClick: onClickBefore, label: "before" }, { photo: after, onClick: onClickAfter, label: "after" }].map(({ photo, onClick, label }) => (
          <button key={label} onClick={onClick} className="overflow-hidden cursor-pointer group" style={{ borderRadius: "var(--border-radius)" }}>
            <Image src={photo.url} alt={photo.caption || (label === "before" ? "Before" : "After")}
              width={400} height={300} className="w-full aspect-[4/3] object-cover transition-transform group-hover:scale-105" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function GallerySection({ section, brandKit }: SectionProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const isProject = section.type === "project_photos";
  const title = (section.content.title as string) || (isProject ? "Your Project" : "Our Work");
  const variant = (section.settings.variant as string) || "grid";
  const rawPhotos = section.content.photos as Photo[] | undefined;

  const photos: Photo[] = rawPhotos?.length
    ? rawPhotos
    : !isProject && brandKit?.companyPhotos?.length
      ? brandKit.companyPhotos.map((url) => ({ url }))
      : [];

  const renderPhoto = (photo: Photo, idx: number) => (
    <button key={photo.url} onClick={() => setLightboxIdx(idx)} className="overflow-hidden cursor-pointer group" style={{ borderRadius: "var(--border-radius)" }}>
      <Image src={photo.url} alt={photo.caption || `Photo ${idx + 1}`}
        width={400} height={300} className="w-full aspect-[4/3] object-cover transition-transform group-hover:scale-105" />
      {photo.caption && <p className="text-xs text-gray-500 mt-1 truncate px-1">{photo.caption}</p>}
    </button>
  );

  const buildItems = () => {
    const items: React.ReactNode[] = [];
    let i = 0;
    while (i < photos.length) {
      if (photos[i].isBefore && i + 1 < photos.length && photos[i + 1].isAfter) {
        const bIdx = i, aIdx = i + 1;
        items.push(<BeforeAfterPair key={`ba-${bIdx}`} before={photos[bIdx]} after={photos[aIdx]}
          onClickBefore={() => setLightboxIdx(bIdx)} onClickAfter={() => setLightboxIdx(aIdx)} />);
        i += 2;
      } else {
        items.push(renderPhoto(photos[i], i));
        i++;
      }
    }
    return items;
  };

  const gridLayout = <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{buildItems()}</div>;

  const carouselLayout = (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {photos.map((p, i) => (
        <button key={p.url} onClick={() => setLightboxIdx(i)} className="flex-shrink-0 w-64 overflow-hidden cursor-pointer group" style={{ borderRadius: "var(--border-radius)" }}>
          <Image src={p.url} alt={p.caption || `Photo ${i + 1}`} width={400} height={300} className="w-full aspect-[4/3] object-cover transition-transform group-hover:scale-105" />
          {p.caption && <p className="text-xs text-gray-500 mt-1 truncate px-1">{p.caption}</p>}
        </button>
      ))}
    </div>
  );

  const masonryLayout = (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
      {photos.map((p, i) => (
        <button key={p.url} onClick={() => setLightboxIdx(i)} className="w-full overflow-hidden cursor-pointer group break-inside-avoid" style={{ borderRadius: "var(--border-radius)" }}>
          <Image src={p.url} alt={p.caption || `Photo ${i + 1}`} width={400} height={300} className="w-full object-cover transition-transform group-hover:scale-105" />
          {p.caption && <p className="text-xs text-gray-500 mt-1 truncate px-1">{p.caption}</p>}
        </button>
      ))}
    </div>
  );

  return (
    <div className="w-full px-4" style={{ paddingTop: "var(--section-spacing)", paddingBottom: "var(--section-spacing)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="ep-section-label" style={{ color: "var(--primary-color)" }}>{isProject ? "Project Photos" : "Gallery"}</span>
          <h2 className="text-xl sm:text-2xl" style={{ color: "var(--primary-color)", fontFamily: "var(--heading-font)", fontWeight: "var(--heading-weight, 700)" as string }}>
            {title}
          </h2>
        </div>
        {photos.length === 0 ? <PlaceholderGrid /> : variant === "carousel" ? carouselLayout : variant === "masonry" ? masonryLayout : gridLayout}
      </div>
      {lightboxIdx !== null && photos[lightboxIdx] && (
        <Lightbox photo={photos[lightboxIdx]} onClose={() => setLightboxIdx(null)} />
      )}
    </div>
  );
}
