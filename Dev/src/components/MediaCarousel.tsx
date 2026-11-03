"use client";

import { useState } from "react";
import type { MediaItem } from "@/data/media";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { MediaContent, type ModoVideo } from "@/components/MediaContent";

export function MediaCarousel({
  items,
  alt,
  className,
  modoVideo,
}: {
  items: MediaItem[];
  alt: string;
  className?: string;
  modoVideo?: ModoVideo;
}) {
  const [index, setIndex] = useState(0);

  if (items.length === 0) {
    return <PlaceholderImage alt={alt} className={className} />;
  }

  const safeIndex = Math.min(index, items.length - 1);
  const current = items[safeIndex];

  function go(delta: number) {
    setIndex((i) => (i + delta + items.length) % items.length);
  }

  return (
    <div className={`relative overflow-hidden bg-[#fafafa] ${className ?? ""}`}>
      <MediaContent url={current.url} tipo={current.tipo} alt={alt} modoVideo={modoVideo} />

      {items.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Anterior"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              go(-1);
            }}
            className="absolute left-1.5 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-neutral-700 transition-colors hover:text-[#c2185b]"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              go(1);
            }}
            className="absolute right-1.5 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-neutral-700 transition-colors hover:text-[#c2185b]"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {items.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${i === safeIndex ? "bg-[#c2185b]" : "bg-white/80"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
