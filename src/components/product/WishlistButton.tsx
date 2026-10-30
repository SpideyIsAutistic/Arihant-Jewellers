"use client";

import { IconHeart } from "@/components/ui/Icons";
import { useWishlist, type WishItem } from "@/store/wishlist";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

export function WishlistButton({ item, className, size = 22 }: { item: WishItem; className?: string; size?: number }) {
  const hydrated = useHydrated();
  const active = useWishlist((s) => s.items.some((i) => i.productId === item.productId));
  const toggle = useWishlist((s) => s.toggle);
  const on = hydrated && active;
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? `Remove ${item.name} from wishlist` : `Add ${item.name} to wishlist`}
      className={cn("grid place-items-center transition-transform active:scale-90", className)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(item);
      }}
    >
      <IconHeart size={size} filled={on} />
    </button>
  );
}
