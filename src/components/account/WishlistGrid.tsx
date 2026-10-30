"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useWishlist } from "@/store/wishlist";
import { useHydrated } from "@/lib/use-hydrated";
import { getProductCards } from "@/lib/actions/store";
import type { ProductCard as Card } from "@/lib/catalog";
import { ProductCard } from "@/components/product/ProductCard";

export function WishlistGrid() {
  const hydrated = useHydrated();
  const items = useWishlist((s) => s.items);
  const [cards, setCards] = useState<Card[] | null>(null);
  const key = items.map((i) => i.productId).join(",");

  useEffect(() => {
    if (!hydrated) return;
    if (!key) {
      setCards([]);
      return;
    }
    getProductCards(key.split(",")).then(setCards);
  }, [hydrated, key]);

  if (!hydrated || cards === null) {
    return <p className="py-24 text-center text-[12px] font-medium tracking-[0.2em] uppercase text-subtle">Loading your wishlist…</p>;
  }

  if (!cards.length) {
    return (
      <div className="py-24 text-center max-w-[460px] mx-auto animate-fade-in">
        <span className="eyebrow">Personal Curations</span>
        <p className="font-serif text-[28px] sm:text-[32px] font-light text-ink mt-2">Your wishlist is empty</p>
        <p className="mt-3 text-[14px] text-body2 leading-relaxed">
          Select the heart on any creation to curate your private wishlist.
        </p>
        <div className="mt-8">
          <Link href="/collections/all" className="btn-outline px-9 py-3.5 text-[12px] tracking-[0.2em]">
            Discover jewellery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-4 pt-8 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 md:gap-8">
      {cards.map((c) => (
        <li key={c.id}>
          <ProductCard card={c} />
        </li>
      ))}
    </ul>
  );
}
