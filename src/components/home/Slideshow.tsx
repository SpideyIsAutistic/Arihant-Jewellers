"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

/**
 * Luxury full-bleed slideshow with smooth cross-fade transitions and rich original colors.
 */
export function Slideshow({
  slides,
  priority = false,
  variant = "hero",
}: {
  slides: Slide[];
  priority?: boolean;
  variant?: "hero" | "promo";
}) {
  // pos: current slide; prev/dir drive the slide-in/slide-out animation
  const [{ index, prev, dir }, setPos] = useState({ index: 0, prev: -1, dir: 1 });
  const go = (n: number, d: number) => setPos((p) => (n === p.index ? p : { index: n, prev: p.index, dir: d }));
  const next = () => setPos((p) => ({ index: (p.index + 1) % slides.length, prev: p.index, dir: 1 }));
  const back = () => setPos((p) => ({ index: (p.index - 1 + slides.length) % slides.length, prev: p.index, dir: -1 }));
  // Only load a slide's images once it's current or next, so the page doesn't download every slide up front.
  const [seen, setSeen] = useState(() => new Set([0, 1]));
  useEffect(() => {
    setSeen((s) => (s.has(index) && s.has((index + 1) % slides.length) ? s : new Set([...s, index, (index + 1) % slides.length])));
  }, [index, slides.length]);
  const touchStartX = useRef<number | null>(null);

  // Autoplay; restarts the timer after every change so a manual swipe/click gets a full interval
  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setTimeout(next, 5500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, slides.length]);

  if (!slides.length) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next();
      else back();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-[#0c0907] select-none",
        variant === "hero" ? "aspect-[4/5] sm:aspect-[2.57/1]" : "aspect-[4/5] sm:aspect-[2.27/1]",
      )}
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero Highlights"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides: the current one sits at 0; the previous slides out, the rest wait off-screen on the side the next one enters from */}
      {slides.map((s, i) => {
        const isActive = i === index;
        const x = isActive ? 0 : i === prev ? -100 * dir : 100 * dir;
        return (
          <div
            key={s.id}
            className={cn(
              "absolute inset-0 h-full w-full ease-[cubic-bezier(.65,0,.35,1)]",
              (isActive || i === prev) && "transition-transform duration-[900ms]",
              isActive ? "z-10" : "z-0 pointer-events-none",
            )}
            style={{ transform: `translateX(${x}%)` }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            aria-hidden={!isActive}
            inert={!isActive}
          >
            {seen.has(i) && <SlideBody slide={s} priority={priority && i === 0} variant={variant} isActive={isActive} />}
          </div>
        );
      })}

      {/* Pagination indicators */}
      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-5 z-20 flex justify-center gap-2 sm:bottom-7">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => go(i, i > index ? 1 : -1)}
              className={cn(
                "h-[2.5px] transition-all duration-500 rounded-full cursor-pointer",
                i === index ? "w-10 bg-[#e6ca85] shadow-xs" : "w-4 bg-white/40 hover:bg-white/80",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SlideBody({
  slide,
  priority,
  variant,
  isActive,
}: {
  slide: Slide;
  priority: boolean;
  variant: "hero" | "promo";
  isActive?: boolean;
}) {
  const align = slide.align;

  const body = (
    <div className="relative h-full w-full bg-[#0c0907]">
      {slide.mobileImage && priority && !slide.image.startsWith("media:") && !slide.mobileImage.startsWith("media:") ? (
        // First slide: one <picture> so the browser fetches only the version for this screen, at once and without the fade-in (fast LCP)
        <picture>
          <source media="(min-width: 640px)" srcSet={slide.image} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slide.mobileImage} alt={slide.title ?? ""} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover sm:object-[50%_30%]" />
        </picture>
      ) : slide.mobileImage ? (
        <>
          {/* Twins sit in display:none wrappers so the hidden one neither loads nor shows its placeholder */}
          <div className="absolute inset-0 hidden sm:block">
            <Img src={slide.image} alt={slide.title ?? ""} fill sizes="100vw" className="object-cover object-[50%_30%]" />
          </div>
          <div className="absolute inset-0 sm:hidden">
            <Img src={slide.mobileImage} alt={slide.title ?? ""} fill sizes="100vw" className="object-cover" />
          </div>
        </>
      ) : (
        <Img
          src={slide.image}
          alt={slide.title ?? ""}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover object-[60%_30%] sm:object-[50%_30%]"
        />
      )}

      {/* Subtle luxury gradient behind typography so white text remains crisp */}
      {(slide.title || slide.subtitle) && (
        <div
          className={cn(
            "absolute inset-0 pointer-events-none",
            "bg-gradient-to-t from-black/70 via-black/25 to-transparent",
            align === "left" && "sm:bg-gradient-to-r sm:from-black/70 sm:via-black/25 sm:to-transparent",
            align === "right" && "sm:bg-gradient-to-l sm:from-black/70 sm:via-black/25 sm:to-transparent",
            align === "center" && "sm:bg-black/30 sm:bg-none",
          )}
        />
      )}

      {/* Content overlay */}
      {(slide.title || slide.subtitle) && (
        <div
          className={cn(
            "page-width absolute inset-0 flex items-end pb-14 sm:items-center sm:pb-0 z-[2]",
            align === "left" && "sm:justify-start",
            align === "center" && "sm:justify-center sm:text-center",
            align === "right" && "sm:justify-end",
          )}
        >
          <div
            className={cn(
              "max-w-[540px] text-white",
              isActive && "animate-fade-in-up",
              align === "center" && "sm:mx-auto",
              align === "right" && "sm:text-right",
            )}
          >
            {slide.title && (
              <p className="font-serif text-[clamp(34px,5vw,70px)] leading-[1.04] font-light tracking-[0.02em]">
                {slide.title}
              </p>
            )}
            {slide.subtitle && (
              <p className="mt-3.5 text-[14px] leading-relaxed text-white/90 sm:text-[16px] font-normal tracking-[0.02em]">
                {slide.subtitle}
              </p>
            )}
            {slide.ctaLabel && slide.href && (
              <div className="mt-7">
                <span className="btn-light">{slide.ctaLabel}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return slide.href ? (
    <Link href={slide.href} className="block h-full w-full" aria-label={slide.title ?? slide.ctaLabel ?? "View collection"}>
      {body}
    </Link>
  ) : (
    body
  );
}
