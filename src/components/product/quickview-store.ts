"use client";

import { create } from "zustand";

export const useQuickView = create<{ productId: string | null; open: (id: string) => void; close: () => void }>((set) => ({
  productId: null,
  open: (productId) => set({ productId }),
  close: () => set({ productId: null }),
}));
