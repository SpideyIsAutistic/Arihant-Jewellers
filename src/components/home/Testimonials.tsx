"use client";

import { useEffect, useState } from "react";
import { Img } from "@/components/ui/Img";
import { cn } from "@/lib/utils";

type T = { id: string; name: string; location: string | null; quote: string; avatar: string | null };

export function Testimonials({ items }: { items: T[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (items.length < 2 || paused) return;
    const t = setInterval(() => setI((n) => (n + 1) % items.length), 7000);
    return () => clearInterval(t);
  }, [items.length, paused]);

  if (!items.length) return null;
  const t = items[i];

  return (
    <section className="page-width pt-20 sm:pt-28" aria-labelledby="testimonials-title">
      <div
        className="border border-line/70 bg-cream/40 px-6 py-14 sm:px-12 sm:py-18 text-center"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <span className="eyebrow">Client Reflections</span>
        <h2 id="testimonials-title" className="h-section">
          Testimonials
        </h2>
        <figure key={t.id} className="mx-auto mt-8 max-w-[680px] animate-fade-in text-center">
          {t.avatar && (
            <div className="relative mx-auto mb-6 h-20 w-20 overflow-hidden rounded-full border border-line bg-cream-2 shadow-xs">
              <Img src={t.avatar} alt={t.name} fill sizes="80px" className="object-cover" />
            </div>
          )}
          <blockquote className="font-serif text-[clamp(18px,2.2vw,24px)] font-normal italic leading-[1.7] text-ink">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-4 text-[12px] font-medium tracking-[0.18em] uppercase text-subtle">
            — {t.name}
            {t.location ? `, ${t.location}` : ""}
          </figcaption>
        </figure>
        {items.length > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {items.map((x, n) => (
              <button
                key={x.id}
                type="button"
                aria-label={`Testimonial ${n + 1}`}
                onClick={() => setI(n)}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  n === i ? "w-6 bg-ink" : "w-2 bg-sand hover:bg-subtle",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
