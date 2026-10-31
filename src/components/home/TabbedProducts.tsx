"use client";

import { useState } from "react";
import type { ProductCard as Card } from "@/lib/catalog";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { cn } from "@/lib/utils";

export function TabbedProducts({ tabs }: { tabs: { label: string; cards: Card[] }[] }) {
  const usable = tabs.filter((t) => t.cards.length > 0);
  const [active, setActive] = useState(0);
  if (!usable.length) return null;
  const current = usable[Math.min(active, usable.length - 1)];
  return (
    <>
      <div
        role="tablist"
        aria-label="Bestseller categories"
        className="no-scrollbar -mx-[var(--gutter)] mb-10 flex justify-start gap-8 overflow-x-auto px-[var(--gutter)] sm:mb-12 sm:justify-center sm:gap-12 border-b border-line/60"
      >
        {usable.map((t, i) => (
          <button
            key={t.label}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={cn(
              "relative shrink-0 pb-3 text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.2em] whitespace-nowrap transition-colors duration-200",
              i === active
                ? "text-ink after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-ink"
                : "text-subtle hover:text-ink",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" key={current.label} className="animate-fade-in">
        <ProductCarousel cards={current.cards} />
      </div>
    </>
  );
}
