"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import { Img } from "@/components/ui/Img";
import { cn } from "@/lib/utils";

export type Slide = {
  id: string;
  title: string | null;
  subtitle: string | null;
  ctaLabel: string | null;
  href: string | null;
  image: string;
  mobileImage: string | null;
  align: "left" | "center" | "right";
};

/** Full-bleed luxury slideshow with restrained maison styling and smooth pagination. */
export function Slideshow({ slides, priority = false, variant = "hero" }: { slides: Slide[]; priority?: boolean; variant?: "hero" | "promo" }) {
  const [ref, api] = useEmblaCarousel(
    { loop: slides.length > 1, duration: 32 },
    [Autoplay({ delay: 6500, stopOnInteraction: false, stopOnMouseEnter: true })],
  );
  const [index, setIndex] = useState(0);
  const onSelect = useCallback(() => api && setIndex(api.selectedScrollSnap()), [api]);

  useEffect(() => {
    if (!api) return;
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  if (!slides.length) return null;

  return (
    <div className="relative overflow-hidden" aria-roledescription="carousel">
      <div ref={ref} className="overflow-hidden">
        <div className="flex touch-pan-y">
          {slides.map((s, i) => (
            <div
              key={s.id}
              className="relative min-w-0 shrink-0 grow-0 basis-full"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
            >
              <SlideBody slide={s} priority={priority && i === 0} variant={variant} />
            </div>
          ))}
        </div>
      </div>
      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-5 z-[5] flex justify-center gap-2 sm:bottom-7">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "h-[2px] transition-all duration-500 rounded-full",
                i === index ? "w-10 bg-white" : "w-4 bg-white/40 hover:bg-white/70",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SlideBody({ slide, priority, variant }: { slide: Slide; priority: boolean; variant: "hero" | "promo" }) {
  const align = slide.align;
  const body = (
    <>
      <div className={cn("relative w-full bg-cream-2", variant === "hero" ? "aspect-[4/5] sm:aspect-[2.57/1]" : "aspect-[4/5] sm:aspect-[2.27/1]")}>
        {slide.mobileImage ? (
          <>
            <Img src={slide.image} alt={slide.title ?? ""} fill priority={priority} sizes="100vw" className="hidden object-cover object-[50%_30%] sm:block" />
            <Img src={slide.mobileImage} alt={slide.title ?? ""} fill priority={priority} sizes="100vw" className="object-cover sm:hidden" />
          </>
        ) : (
          <Img src={slide.image} alt={slide.title ?? ""} fill priority={priority} sizes="100vw" className="object-cover object-[60%_30%] sm:object-[50%_30%]" />
        )}
        <div
          className={cn(
            "absolute inset-0",
            "bg-gradient-to-t from-black/60 via-black/15 to-transparent",
            align === "left" && "sm:bg-gradient-to-r sm:from-black/55 sm:via-black/15 sm:to-transparent",
            align === "right" && "sm:bg-gradient-to-l sm:from-black/55 sm:via-black/15 sm:to-transparent",
            align === "center" && "sm:bg-black/25 sm:bg-none",
          )}
        />
      </div>
      {(slide.title || slide.subtitle) && (
        <div
          className={cn(
            "page-width absolute inset-0 flex items-end pb-14 sm:items-center sm:pb-0 z-[2]",
            align === "left" && "sm:justify-start",
            align === "center" && "sm:justify-center sm:text-center",
            align === "right" && "sm:justify-end",
          )}
        >
          <div className={cn("max-w-[540px] text-white animate-fade-in-up", align === "center" && "sm:mx-auto", align === "right" && "sm:text-right")}>
            {slide.title && (
              <p className="font-serif text-[clamp(34px,5vw,70px)] leading-[1.04] font-light tracking-[0.02em]">{slide.title}</p>
            )}
            {slide.subtitle && <p className="mt-3.5 text-[14px] leading-relaxed text-white/90 sm:text-[16px] font-normal tracking-[0.02em]">{slide.subtitle}</p>}
            {slide.ctaLabel && slide.href && (
              <div className="mt-7">
                <span className="btn-light">{slide.ctaLabel}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
  return slide.href ? (
    <Link href={slide.href} className="block" aria-label={slide.title ?? slide.ctaLabel ?? "View collection"}>
      {body}
    </Link>
  ) : (
    body
  );
}
