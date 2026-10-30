"use client";

import Link from "next/link";
import { useState } from "react";
import { Img } from "@/components/ui/Img";
import type { ProductCard as Card } from "@/lib/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { IconChevronLeft, IconChevronRight } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

export type LookSpot = { card: Card; x: number; y: number };

export function ShopTheLook({ image, title, spots }: { image: string; title: string; spots: LookSpot[] }) {
  const [i, setI] = useState(0);
  if (!spots.length) return null;
  const current = spots[i];
  const go = (d: number) => setI((n) => (n + d + spots.length) % spots.length);

  return (
    <div className="relative grid items-center gap-10 md:grid-cols-[1.15fr_1fr] md:gap-14 lg:gap-20">
      <div className="relative aspect-[4/5] overflow-hidden border border-line/70 bg-cream-2 md:aspect-[0.86]">
        <Img src={image} alt={title} fill sizes="(min-width:1000px) 50vw, 100vw" className="object-cover" />
        {spots.map((s, n) => (
          <button
            key={s.card.id}
            type="button"
            aria-label={`Show ${s.card.name}`}
            onClick={() => setI(n)}
            className="absolute grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/40 backdrop-blur-sm transition-transform hover:scale-125"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
          >
            <span
              className={cn(
                "h-3.5 w-3.5 rounded-full bg-white shadow-md transition-all duration-300",
                n === i && "scale-125 ring-2 ring-ink ring-offset-1",
              )}
            />
          </button>
        ))}
      </div>
      <div className="relative mx-auto w-full max-w-[320px] text-center">
        <div key={current.card.id} className="animate-fade-in text-left">
          <ProductCard card={current.card} variant="carousel" sizes="320px" />
        </div>
        <div className="mt-7">
          <Link href={`/products/${current.card.slug}`} className="btn w-full">
            View product
          </Link>
        </div>
        {spots.length > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {spots.map((_, n) => (
              <button
                key={n}
                type="button"
                aria-label={`Look item ${n + 1}`}
                onClick={() => setI(n)}
                className={cn(
                  "h-[2px] transition-all duration-300 rounded-full",
                  n === i ? "w-8 bg-ink" : "w-3 bg-line hover:bg-subtle",
                )}
              />
            ))}
          </div>
        )}
      </div>
      {spots.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous item"
            onClick={() => go(-1)}
            className="absolute top-1/2 left-0 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-white/95 text-ink shadow-sm transition-colors hover:bg-ink hover:text-white md:grid"
          >
            <IconChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next item"
            onClick={() => go(1)}
            className="absolute top-1/2 right-0 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-white/95 text-ink shadow-sm transition-colors hover:bg-ink hover:text-white md:grid"
          >
            <IconChevronRight size={18} />
          </button>
        </>
      )}
    </div>
  );
}
