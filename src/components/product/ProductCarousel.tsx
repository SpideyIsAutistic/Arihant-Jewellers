"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import type { ProductCard as Card } from "@/lib/catalog";
import { ProductCard } from "./ProductCard";
import { IconChevronLeft, IconChevronRight } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

export function ProductCarousel({ cards, variant = "carousel", className }: { cards: Card[]; variant?: "carousel" | "grid"; className?: string }) {
  const [ref, api] = useEmblaCarousel({ align: "start", slidesToScroll: 1, containScroll: "trimSnaps" });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    if (!api) return;
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    update();
    api.on("select", update).on("reInit", update);
    return () => {
      api.off("select", update).off("reInit", update);
    };
  }, [api, update]);

  if (!cards.length) return null;

  return (
    <div className={cn("relative", className)}>
      <div ref={ref} className="overflow-hidden">
        <ul className="-ml-3 flex touch-pan-y sm:-ml-4">
          {cards.map((c) => (
            <li key={c.id} className="min-w-0 shrink-0 grow-0 basis-[48%] pl-3 sm:basis-1/3 sm:pl-4 md:basis-1/4">
              <ProductCard card={c} variant={variant} sizes="(min-width:1150px) 23vw, (min-width:700px) 31vw, 46vw" />
            </li>
          ))}
        </ul>
      </div>
      {(canPrev || canNext) && (
        <>
          <button
            type="button"
            aria-label="Previous products"
            onClick={() => api?.scrollPrev()}
            disabled={!canPrev}
            className="absolute top-[38%] -left-3 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-white/95 text-ink shadow-sm backdrop-blur-xs transition-all hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-0 md:grid lg:-left-5"
          >
            <IconChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next products"
            onClick={() => api?.scrollNext()}
            disabled={!canNext}
            className="absolute top-[38%] -right-3 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-white/95 text-ink shadow-sm backdrop-blur-xs transition-all hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-0 md:grid lg:-right-5"
          >
            <IconChevronRight size={18} />
          </button>
        </>
      )}
    </div>
  );
}
