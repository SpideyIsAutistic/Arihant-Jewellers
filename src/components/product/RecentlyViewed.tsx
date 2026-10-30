"use client";

import { useEffect, useState } from "react";
import { useRecent } from "@/store/recent";
import { getProductCards } from "@/lib/actions/store";
import type { ProductCard as Card } from "@/lib/catalog";
import { ProductCarousel } from "./ProductCarousel";
import { useHydrated } from "@/lib/use-hydrated";

export function RecentlyViewed({ excludeId, title = "Recently viewed products" }: { excludeId?: string; title?: string }) {
  const hydrated = useHydrated();
  const ids = useRecent((s) => s.ids);
  const [cards, setCards] = useState<Card[]>([]);
  const key = ids.filter((i) => i !== excludeId).join(",");

  useEffect(() => {
    if (!hydrated || !key) return;
    getProductCards(key.split(",")).then(setCards);
  }, [hydrated, key]);

  if (!cards.length) return null;

  return (
    <section className="page-width pt-20 sm:pt-28" aria-labelledby="recent-title">
      <span className="eyebrow">Your Journey</span>
      <h2 id="recent-title" className="h-section mb-10 sm:mb-14">
        {title}
      </h2>
      <ProductCarousel cards={cards} />
    </section>
  );
}
