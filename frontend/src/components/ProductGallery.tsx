"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Props = {
  alt: string;
  /** Single catalog image — duplicated for carousel demo when only one source exists */
  images: string[];
};

export function ProductGallery({ alt, images }: Props) {
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
    setIndex((i) => (slides.length ? (i - 1 + slides.length) % slides.length : 0));
  const next = () =>
    setIndex((i) => (slides.length ? (i + 1) % slides.length : 0));

  if (!main) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden bg-white">
        <Image
          src={main}
          alt={alt}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, 480px"
          priority
        />
        {slides.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-2 py-2 text-gray-800 shadow hover:bg-white"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-2 py-2 text-gray-800 shadow hover:bg-white"
            >
              ›
            </button>
          </>
        )}
      </div>
      <div className="flex gap-2 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory sm:snap-none [&::-webkit-scrollbar]:hidden">
        {slides.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setIndex(i)}
            className={`relative h-14 w-14 shrink-0 snap-start overflow-hidden rounded border-2 bg-white touch-manipulation sm:h-16 sm:w-16 md:h-20 md:w-20 ${
              i === safeIndex ? "border-[#e77600]" : "border-transparent"
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
