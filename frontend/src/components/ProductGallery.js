"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export function ProductGallery({ alt, images }) {
  const slides = useMemo(() => {
    const list = images.filter(Boolean);
    if (list.length === 0) return [];
    if (list.length === 1) return [list[0], list[0], list[0]];
    return list;
  }, [images]);

  const [index, setIndex] = useState(0);
  const safeIndex = Math.min(index, Math.max(0, slides.length - 1));
  const main = slides[safeIndex] ?? "";

  const prev = () =>
    setIndex((i) =>
      slides.length ? (i - 1 + slides.length) % slides.length : 0,
    );
  const next = () =>
    setIndex((i) => (slides.length ? (i + 1) % slides.length : 0));

  if (!main) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* Main image with glow */}
      <div className="relative aspect-square w-full overflow-hidden bg-white rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.08)]">
        <Image
          src={main}
          alt={alt}
          fill
          className="object-contain p-6 transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 480px"
          priority
        />

        {slides.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-xl text-gray-800 shadow-md hover:bg-white hover:shadow-lg transition-shadow"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-xl text-gray-800 shadow-md hover:bg-white hover:shadow-lg transition-shadow"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory sm:snap-none [&::-webkit-scrollbar]:hidden">
        {slides.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setIndex(i)}
            className={`relative h-16 w-16 shrink-0 snap-start overflow-hidden rounded-md border-2 bg-white touch-manipulation sm:h-18 sm:w-18 md:h-20 md:w-20 transition-all ${
              i === safeIndex
                ? "border-[#e77600] shadow-[0_0_6px_rgba(231,118,0,0.4)]"
                : "border-[#d5d9d9] hover:border-[#e77600]"
            }`}
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-contain p-1"
              sizes="80px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
