"use client";

import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { IconPlus, IconWhatsApp } from "@/components/ui/Icons";
import type { ProductCard as Card } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { RatingInline } from "./Rating";
import { WishlistButton } from "./WishlistButton";
import { enquire } from "@/store/site";
import { useQuickView } from "./quickview-store";

type Props = {
  card: Card;
  variant?: "grid" | "carousel" | "list";
  priority?: boolean;
  sizes?: string;
};

export function ProductCard({ card, variant = "grid", priority, sizes }: Props) {
  const openQuickView = useQuickView((s) => s.open);
  const href = `/products/${card.slug}`;
  const wish = { productId: card.id, slug: card.slug, name: card.name, image: card.image, price: card.price };

  if (variant === "list") {
    return (
      <article className="group grid grid-cols-[120px_1fr] gap-4 border border-line/60 bg-white p-3 transition-colors hover:border-line sm:grid-cols-[180px_1fr] sm:gap-6 sm:p-4">
        <Link href={href} className="relative block aspect-[4/5] overflow-hidden bg-cream/70">
          <Img
            src={card.image}
            alt={card.imageAlt}
            fill
            sizes="180px"
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
          />
          {card.discountPct > 0 && (
            <span className="ribbon absolute top-2.5 left-2.5 z-[2]">Save {card.discountPct}%</span>
          )}
        </Link>
        <div className="flex flex-col py-1">
          {card.categoryName && (
            <p className="text-[10px] tracking-[0.18em] text-subtle uppercase">
              {card.categoryName} · {card.metal}
            </p>
          )}
          <Link href={href} className="font-serif text-[16px] sm:text-[18px] text-ink hover:text-subtle transition-colors leading-snug mt-1">
            {card.name}
          </Link>
          <PriceRow card={card} />
          <div className="mt-auto flex items-center gap-3 pt-3">
            <button
              type="button"
              className="btn-outline px-4 py-2 text-[11px] tracking-[0.16em]"
              onClick={() => enquire(card)}
            >
              Enquire
            </button>
            <WishlistButton item={wish} className="h-9 w-9 border border-line bg-white" size={17} />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative flex flex-col border border-line/70 bg-white transition-all duration-500 ease-out hover:border-black/20 hover:shadow-[0_12px_28px_rgba(0,0,0,0.05)]">
      {/* Image Framing with slow zoom and smooth secondary image crossfade */}
      <div className="relative aspect-[4/5] overflow-hidden bg-cream/70">
        <Link href={href} aria-label={card.name} className="absolute inset-0 z-[1]" tabIndex={-1} />

        {/* Primary Image */}
        <Img
          src={card.image}
          alt={card.imageAlt}
          fill
          priority={priority}
          sizes={sizes ?? "(min-width:1150px) 23vw, (min-width:700px) 31vw, 48vw"}
          className={cn(
            "object-cover transition-all duration-1000 ease-out group-hover:scale-[1.04]",
            card.image2 && "group-hover:opacity-0",
          )}
        />

        {/* Secondary Image crossfade on hover */}
        {card.image2 && (
          <Img
            src={card.image2}
            alt=""
            fill
            sizes={sizes ?? "(min-width:1150px) 23vw, (min-width:700px) 31vw, 48vw"}
            className="object-cover opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-[1.04]"
            loading="lazy"
          />
        )}

        {/* Restrained luxury badges */}
        {card.discountPct > 0 && (
          <span className="ribbon animate-fade-in pointer-events-none absolute top-3 left-3 z-[2]">
            Save {card.discountPct}%
          </span>
        )}

        {card.metal === "Gold" && card.price > 0 && card.weightGrams && (
          <span className="pointer-events-none absolute top-3 right-3 z-[2] flex items-center gap-1.5 border border-line bg-white/95 px-2 py-0.5 text-[10px] font-medium tracking-wider text-ink uppercase backdrop-blur-xs shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Live Rate
          </span>
        )}

        {!card.inStock && (
          <span className="pointer-events-none absolute top-3 left-3 z-[2] border border-line bg-white/95 px-2.5 py-1 text-[10px] font-medium tracking-[0.16em] text-ink uppercase backdrop-blur-xs">
            Sold out
          </span>
        )}

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-[2]">
          {!(card.metal === "Gold" && card.price > 0 && card.weightGrams) && (
            <WishlistButton item={wish} className="h-8 w-8 rounded-full border border-line/60 bg-white/90 text-ink shadow-xs backdrop-blur-xs transition-transform hover:scale-110" />
          )}
        </div>

        {/* Refined Quick Action Overlay Bar */}
        {(
          <div className="absolute inset-x-3 bottom-3 z-[3] flex items-center justify-between gap-2 opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0">
            <button
              type="button"
              onClick={() => enquire(card)}
              className="flex h-9 flex-1 items-center justify-center gap-1.5 border border-line bg-white/95 text-[11px] font-medium tracking-[0.14em] text-ink uppercase shadow-xs backdrop-blur-xs transition-colors hover:bg-ink hover:text-white"
              aria-label={`Enquire about ${card.name} on WhatsApp`}
            >
              <IconWhatsApp size={15} />
              <span>Enquire</span>
            </button>
            <button
              type="button"
              onClick={() => openQuickView(card.id)}
              className="grid h-9 w-9 shrink-0 place-items-center border border-line bg-white/95 text-ink shadow-xs backdrop-blur-xs transition-colors hover:bg-ink hover:text-white"
              aria-label={`Quick view ${card.name}`}
            >
              <IconPlus size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Product Card Details */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        {card.categoryName && (
          <p className="mb-1 text-[10px] font-medium tracking-[0.2em] text-subtle uppercase">
            {card.categoryName}
          </p>
        )}
        <h3 className="line-clamp-1 font-serif text-[15px] sm:text-[16px] font-normal tracking-[0.02em] text-ink transition-colors group-hover:text-subtle">
          <Link href={href}>
            {card.name}
          </Link>
        </h3>
        <PriceRow card={card} />
      </div>
    </article>
  );
}

function PriceRow({ card }: { card: Card }) {
  return (
    <div className="mt-2.5 flex items-baseline justify-between gap-2 border-t border-line/50 pt-2.5">
      <div className="flex flex-wrap items-baseline gap-1.5">
        <p className="text-[15px] sm:text-[16px] font-semibold text-ink tracking-tight">
          <span className="sr-only">Sale price </span>
          {formatPrice(card.price)}
        </p>
        {card.compareAt && (
          <p className="text-[12px] sm:text-[13px] text-subtle/60 line-through">
            <span className="sr-only">Regular price </span>
            {formatPrice(card.compareAt)}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {card.metal === "Gold" && card.weightGrams && (
          <span className="text-[11px] font-medium text-subtle tracking-wide">
            {card.weightGrams}g
          </span>
        )}
        {card.rating ? <RatingInline avg={card.rating.avg} count={card.rating.count} /> : null}
      </div>
    </div>
  );
}
