"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Slide } from "@/components/home/Slideshow";
import { IconClose } from "@/components/ui/Icons";

const P = (name: string) => `/promo/${name}.webp`;
const slide = (id: string, art: string, title: string, subtitle: string, ctaLabel: string, href: string): Slide => ({
  id,
  title,
  subtitle,
  ctaLabel,
  href,
  image: P(art),
  mobileImage: P(`${art}-m`),
  align: "left",
});

const DHANTERAS_END = new Date("2026-11-07T00:00:00+05:30").getTime();

/** Designed hero slides for the services, shown alongside the admin's hero banners. */
export const PROMO_SLIDES = {
  dhanteras: {
    id: "promo-dhanteras",
    title: null,
    subtitle: null,
    ctaLabel: null,
    href: "/collections/catalogue",
    image: "/promo/dhanteras-hero.webp",
    mobileImage: "/promo/dhanteras-hero-m.webp",
    align: "left" as const,
  },
  rest: [
    slide("promo-rate", "gold-rate", "Priced at Today's Gold Rate", "Weight × today's rate + making + stones + GST, shown in full on every piece.", "See today's rate", "/gold-rate-today"),
    slide("promo-exchange", "gold-exchange", "What Is Your Old Gold Worth?", "Estimate it at today's rate and get a quote for exchange.", "Estimate value", "/gold-exchange"),
    slide("promo-savings", "savings", "Save Towards Your Next Piece", "Our gold savings scheme. Ask us for this year's terms.", "Learn more", "/pages/gold-savings-scheme"),
  ],
};

/** Hero order: Dhanteras first until the festival, admin banners, then the service slides. */
export function withPromoSlides(hero: Slide[], now: number) {
  return [...(now < DHANTERAS_END ? [PROMO_SLIDES.dhanteras] : []), ...hero, ...PROMO_SLIDES.rest];
}

const POPUPS = [
  {
    until: DHANTERAS_END,
    art: "dhanteras",
    eyebrow: "Dhanteras · Friday 6 November",
    title: "Celebrate Dhanteras at Arihant",
    text: "See festive gold, diamonds and silver idols in the showroom. Book a time and we'll have your picks ready.",
    cta: { label: "Book a Dhanteras visit", href: "/festive/dhanteras-diwali" },
    alt: { label: "Today's gold rate", href: "/gold-rate-today" },
  },
  {
    until: Infinity,
    art: "gold-exchange",
    eyebrow: "Old gold exchange",
    title: "Turn Old Gold Into Something New",
    text: "Estimate your old gold at today's rate and exchange it towards a new piece.",
    cta: { label: "Estimate value", href: "/gold-exchange" },
    alt: { label: "Gold savings scheme", href: "/pages/gold-savings-scheme" },
  },
];

const SEEN = "aj:promo-seen";

/** Promo pop-up: once per browser session, a few seconds in, never on top of another open panel. */
export function PromoPopup() {
  const [promo, setPromo] = useState<(typeof POPUPS)[number] | null>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN)) return;
    } catch {}
    const start = Date.now();
    const t = setInterval(() => {
      if (Date.now() - start < 2000 || document.querySelector('[role="dialog"]')) return;
      clearInterval(t);
      setPromo(POPUPS.find((p) => Date.now() < p.until) ?? null);
      try {
        sessionStorage.setItem(SEEN, "1");
      } catch {}
    }, 500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!promo) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPromo(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [promo]);

  if (!promo) return null;
  const close = () => setPromo(null);

  if (promo.art === "dhanteras") {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-5">
        <div aria-hidden className="absolute inset-0 animate-fade-in bg-black/80 backdrop-blur-xs" onClick={close} />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Arihant Jewellers Dhanteras - Bring Home Prosperity"
          className="relative w-full max-w-[min(100%,calc(82vh*776/1276))] animate-fade-in-up overflow-hidden rounded-[16px] sm:max-w-[760px] border border-[#c5a366]/60 shadow-[0_16px_50px_rgba(0,0,0,0.7)]"
        >
          {/* Close button */}
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute top-3.5 right-3.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-[#f5d58d] hover:bg-black hover:text-white transition-all border border-[#c5a366]/40 cursor-pointer shadow-md"
          >
            <IconClose size={18} />
          </button>

          {/* Interactive banner link to /collections/catalogue */}
          <Link href="/collections/catalogue" onClick={close} className="group block focus:outline-none">
            {/* Desktop popup image */}
            <div className="hidden sm:block aspect-[1692/1016] w-full bg-black relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/promo/dhanteras-popup-desktop.webp"
                alt="Arihant Jewellers Dhanteras - Bring Home Prosperity - Explore Collection"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
              />
            </div>

            {/* Mobile popup image */}
            <div className="block sm:hidden aspect-[776/1276] w-full bg-black relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/promo/dhanteras-popup-mobile.webp"
                alt="Arihant Jewellers Dhanteras - Bring Home Prosperity - Explore Collection"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
              />
            </div>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div aria-hidden className="absolute inset-0 animate-fade-in bg-black/60" onClick={close} />
      <div role="dialog" aria-modal="true" aria-labelledby="promo-popup-title" className="relative grid w-full max-w-[760px] animate-fade-in-up overflow-hidden bg-white sm:grid-cols-[1fr_1.1fr]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={P(promo.art)} alt="" className="h-40 w-full object-cover object-[87%_50%] sm:h-full" />
        <div className="flex flex-col justify-center p-7 sm:p-10">
          <span className="text-[10px] font-medium tracking-[0.2em] text-subtle uppercase sm:text-[11px]">{promo.eyebrow}</span>
          <h2 id="promo-popup-title" className="mt-2 font-serif text-[26px] leading-[1.15] font-light text-ink sm:text-[30px]">
            {promo.title}
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-body2">{promo.text}</p>
          <Link href={promo.cta.href} onClick={close} className="btn mt-6">
            {promo.cta.label}
          </Link>
          <Link href={promo.alt.href} onClick={close} className="mt-4 text-center text-[11px] font-medium tracking-[0.18em] text-subtle uppercase underline underline-offset-4 hover:text-ink">
            {promo.alt.label}
          </Link>
        </div>
        <button type="button" aria-label="Close" onClick={close} className="absolute top-3 right-3 bg-white/90 p-1.5 text-ink hover:text-subtle">
          <IconClose size={18} />
        </button>
      </div>
    </div>
  );
}
