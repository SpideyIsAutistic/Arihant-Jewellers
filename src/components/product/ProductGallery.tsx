"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Img } from "@/components/ui/Img";
import { IconChevronLeft, IconChevronRight, IconClose } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

type Image = { url: string; alt: string | null };

export function ProductGallery({ images, name, badge }: { images: Image[]; name: string; badge?: React.ReactNode }) {
  const [ref, api] = useEmblaCarousel({ loop: false });
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<number | null>(null);

  const onSelect = useCallback(() => api && setIndex(api.selectedScrollSnap()), [api]);
  useEffect(() => {
    if (!api) return;
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  const list = images.length ? images : [{ url: "", alt: name }];

  return (
    <>
      {/* Mobile / tablet: swipe carousel */}
      <div className="relative md:hidden">
        <div ref={ref} className="overflow-hidden border border-line/70">
          <div className="flex touch-pan-y">
            {list.map((img, i) => (
              <button
                key={i}
                type="button"
                className="relative aspect-square min-w-0 shrink-0 grow-0 basis-full bg-cream/40"
                onClick={() => setZoom(i)}
                aria-label={`Open image ${i + 1} of ${list.length}`}
              >
                <Img src={img.url || null} alt={img.alt || name} fill priority={i === 0} sizes="100vw" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
        {badge && <div className="pointer-events-none absolute top-4 left-0 z-[2]">{badge}</div>}
        {list.length > 1 && (
          <div className="mt-3 flex justify-center gap-1.5">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                onClick={() => api?.scrollTo(i)}
                className={cn(
                  "h-[2px] transition-all duration-300 rounded-full",
                  i === index ? "w-7 bg-ink" : "w-3 bg-line hover:bg-subtle",
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop: stacked images with pristine architectural framing */}
      <div className="hidden space-y-4 md:block">
        {list.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setZoom(i)}
            className="group relative block aspect-square w-full cursor-zoom-in overflow-hidden border border-line/70 bg-cream/40 transition-colors hover:border-black/20"
            aria-label={`Zoom image ${i + 1}`}
          >
            <Img
              src={img.url || null}
              alt={img.alt || name}
              fill
              priority={i === 0}
              sizes="(min-width:1000px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {i === 0 && badge && <span className="pointer-events-none absolute top-5 left-0 z-[2]">{badge}</span>}
          </button>
        ))}
      </div>

      {zoom !== null && <Lightbox images={list} start={zoom} name={name} onClose={() => setZoom(null)} />}
    </>
  );
}

function Lightbox({ images, start, name, onClose }: { images: Image[]; start: number; name: string; onClose: () => void }) {
  const [i, setI] = useState(start);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setI((n) => (n + 1) % images.length);
      if (e.key === "ArrowLeft") setI((n) => (n - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [images.length, onClose]);

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={`${name} images`} className="fixed inset-0 z-[80] animate-fade-in bg-white/95 backdrop-blur-md">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 z-10 p-2 text-ink hover:text-subtle transition-colors"
      >
        <IconClose size={26} />
      </button>
      <div className="relative h-full w-full">
        <Img src={images[i].url || null} alt={images[i].alt || name} fill sizes="100vw" className="object-contain p-6" />
      </div>
      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => setI((n) => (n - 1 + images.length) % images.length)}
            className="absolute top-1/2 left-4 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-white/90 text-ink shadow-sm transition-colors hover:bg-ink hover:text-white"
          >
            <IconChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => setI((n) => (n + 1) % images.length)}
            className="absolute top-1/2 right-4 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-white/90 text-ink shadow-sm transition-colors hover:bg-ink hover:text-white"
          >
            <IconChevronRight size={20} />
          </button>
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] font-medium tracking-[0.2em] uppercase text-subtle">
            {i + 1} / {images.length}
          </p>
        </>
      )}
    </div>,
    document.body,
  );
}
