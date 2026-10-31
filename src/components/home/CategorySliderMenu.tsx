"use client";

import Link from "next/link";
import { useRef } from "react";
import { Img } from "@/components/ui/Img";
import { IconChevronLeft, IconChevronRight, IconWhatsApp } from "@/components/ui/Icons";
import { useSiteInfo, whatsappUrl } from "@/store/site";
import { requireLogin } from "@/store/customer";

type SliderItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  image?: string;
  isWhatsApp?: boolean;
  badge?: string;
};

const SLIDER_ITEMS: SliderItem[] = [
  {
    id: "dhanteras",
    title: "Dhanteras",
    subtitle: "Festive Picks",
    href: "/festive/dhanteras-diwali",
    image: "/promo/dhanteras-thumb.webp",
    badge: "Festive",
  },
  {
    id: "catalogue",
    title: "All Catalogue",
    subtitle: "Explore 100+ Pieces",
    href: "/collections/catalogue",
    image: "/catalogue/gold-coin-long-necklace-1.webp",
    badge: "Catalogue",
  },
  {
    id: "diamonds",
    title: "Diamonds",
    subtitle: "Rings & Sets",
    href: "/collections/diamond-jewellery",
    image: "/catalogue/diamond-cage-statement-band-1.webp",
  },
  {
    id: "gold",
    title: "Gold Jewellery",
    subtitle: "Chains & Sets",
    href: "/collections/gold-jewellery",
    image: "/catalogue/delicate-gold-necklace-1.webp",
  },
  {
    id: "mangalsutra",
    title: "Mangalsutra",
    subtitle: "Bridal & Everyday",
    href: "/collections/mangalsutra",
    image: "/catalogue/classic-gold-mangalsutra-1.webp",
  },
  {
    id: "gemstones",
    title: "Gemstones",
    subtitle: "Panna, Pukhraj, Neelam",
    href: "/collections/gemstones",
    image: "/catalogue/deep-green-emerald-panna-1.webp",
  },
  {
    id: "silver",
    title: "Silver Idols",
    subtitle: "Puja & Gifts",
    href: "/collections/silver-articles",
    image: "/catalogue/ashtalakshmi-silver-idol-set-on-carved-stand-2.webp",
  },
  {
    id: "custom-design",
    title: "Custom Design",
    subtitle: "Send us your idea",
    href: "/pages/custom-design",
    image: "/catalogue/emerald-floral-cocktail-ring-1.webp",
    badge: "Bespoke",
  },
  {
    id: "gold-rate",
    title: "Gold Rate Today",
    subtitle: "Live Market Rate",
    href: "/gold-rate-today",
    image: "/promo/gold-rate-m.webp",
    badge: "Live",
  },
  {
    id: "whatsapp",
    title: "WhatsApp",
    subtitle: "Enquire Directly",
    href: "",
    isWhatsApp: true,
    badge: "Chat",
  },
];

export function CategorySliderMenu() {
  const scrollRef = useRef<HTMLDivElement>(null);
  // shortcut: falls back to the number added here before Admin → Settings had one; remove once the WhatsApp number is saved in Settings
  const waNumber = useSiteInfo((s) => s.whatsapp) || "919324683313";
  const waHref = whatsappUrl(waNumber, "Hi Arihant Jewellers, I would like to enquire about your jewellery collection.");

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const offset = direction === "left" ? -280 : 280;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section className="relative border-b border-line/60 bg-cream-2/40 py-6 sm:py-8" aria-label="Explore Collections Menu">
      <div className="page-width relative">
        {/* Navigation arrows for desktop */}
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll menu left"
          className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/95 p-2 shadow-md border border-line text-ink hover:bg-cream hover:scale-105 transition-all md:flex"
        >
          <IconChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll menu right"
          className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/95 p-2 shadow-md border border-line text-ink hover:bg-cream hover:scale-105 transition-all md:flex"
        >
          <IconChevronRight size={18} />
        </button>

        {/* Horizontal scroll container */}
        <div
          ref={scrollRef}
          className="flex items-center gap-5 sm:gap-7 overflow-x-auto no-scrollbar px-2 py-1 md:px-12 scroll-smooth"
        >
          {SLIDER_ITEMS.map((item) => {
            if (item.isWhatsApp) item = { ...item, href: waHref ?? "/pages/contact" };
            const isExternal = item.href.startsWith("http");
            const Component = isExternal ? "a" : Link;
            const extraProps = isExternal
              ? { target: "_blank", rel: "noopener noreferrer", onClick: (e: React.MouseEvent) => !requireLogin() && e.preventDefault() }
              : {};

            return (
              <Component
                key={item.id}
                href={item.href}
                {...extraProps}
                className="group flex flex-col items-center shrink-0 w-[92px] sm:w-[110px] text-center focus:outline-none"
              >
                {/* Circular thumbnail with glowing gold border on hover */}
                <div className="relative mb-4 h-[68px] w-[68px] sm:h-[82px] sm:w-[82px] rounded-full p-[2px] transition-all duration-300 group-hover:scale-105 ring-1 ring-line/80 group-hover:ring-2 group-hover:ring-[#c5a366]">
                  <div className="h-full w-full rounded-full overflow-hidden bg-cream relative shadow-xs">
                    {item.isWhatsApp ? (
                      <div className="flex h-full w-full items-center justify-center bg-[#25D366] text-white transition-transform group-hover:scale-110 duration-300">
                        <IconWhatsApp size={36} />
                      </div>
                    ) : (
                      item.image && (
                        <Img
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="82px"
                          className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                        />
                      )
                    )}
                  </div>

                  {/* Optional small top badge */}
                  {item.badge && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#1c1815] px-2 py-0.5 text-[9px] font-medium tracking-[0.08em] uppercase text-[#e6ca85] border border-[#c5a366]/60 shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Title and subtitle */}
                <span className="font-serif text-[13px] sm:text-[14px] font-medium leading-tight text-ink group-hover:text-[#a8823b] transition-colors line-clamp-1">
                  {item.title}
                </span>
                <span className="mt-0.5 text-[10px] sm:text-[11px] text-subtle tracking-[0.02em] line-clamp-1">
                  {item.subtitle}
                </span>
              </Component>
            );
          })}
        </div>
      </div>
    </section>
  );
}
