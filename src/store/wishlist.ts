"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";

export type WishItem = { productId: string; slug: string; name: string; image: string | null; price: number };

type WishState = {
  items: WishItem[];
  toggle: (item: WishItem) => void;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
};

export const useWishlist = create<WishState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) =>
        set((s) =>
          s.items.some((i) => i.productId === item.productId)
            ? { items: s.items.filter((i) => i.productId !== item.productId) }
            : { items: [item, ...s.items].slice(0, 100) },
        ),
      remove: (productId) => set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
      has: (productId) => get().items.some((i) => i.productId === productId),
    }),
    { name: "aj-wishlist", storage: createJSONStorage(() => localStorage), version: 1 },
  ),
);

/* Signed-in visitors keep their wishlist in wishlists/<uid>, so it follows them across devices.
   On sign-in, items saved as a guest are merged in; on sign-out this browser's copy is cleared. */
if (typeof window !== "undefined") {
  let uid: string | null | undefined;
  let applying = false;
  const save = (items: WishItem[]) => uid && setDoc(doc(db(), "wishlists", uid), { items, updatedAt: Date.now() }).catch(() => {});
  onAuthStateChanged(auth(), async (u) => {
    const wasSignedIn = !!uid;
    uid = u?.uid ?? null;
    if (!u) {
      if (wasSignedIn) useWishlist.setState({ items: [] }); // shared computers: don't leave the last person's list behind
      return;
    }
    const snap = await getDoc(doc(db(), "wishlists", u.uid)).catch(() => null);
    const remote = ((snap?.data()?.items ?? []) as WishItem[]).filter((r) => r && r.productId);
    const local = useWishlist.getState().items;
    const merged = [...local, ...remote.filter((r) => !local.some((l) => l.productId === r.productId))].slice(0, 100);
    applying = true;
    useWishlist.setState({ items: merged });
    applying = false;
    save(merged);
  });
  useWishlist.subscribe((s, prev) => {
    if (!applying && s.items !== prev.items) save(s.items);
  });
}
