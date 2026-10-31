import type { Metadata } from "next";
import { WishlistGrid } from "@/components/account/WishlistGrid";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false } };

export default function WishlistPage() {
  return (
    <div className="page-width py-10 sm:py-14">
      <h1 className="h-section">Wishlist</h1>
      <p className="mt-2 text-center text-[14px] text-subtle">Saved on this device.</p>
      <WishlistGrid />
    </div>
  );
}
