"use client";

import { create } from "zustand";
import { requireLogin } from "@/store/customer";
import { trackLead } from "@/lib/analytics";

/** Store-wide contact details, filled in by the store layout once settings load. */
export const useSiteInfo = create<{ whatsapp: string; set: (v: { whatsapp: string }) => void }>((set) => ({
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "",
  set: (v) => set(v),
}));

export function whatsappUrl(number: string, text: string) {
  const digits = number.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : null;
}

/** Opens a WhatsApp chat pre-filled with the product; falls back to the product page's enquiry form. */
export function enquire(p: { name: string; slug: string; sku?: string | null }, extra = "") {
  if (!requireLogin()) return;
  const url = `${window.location.origin}/products/${p.slug}`;
  const text = `Hi Arihant Jewellers, I'm interested in "${p.name}"${p.sku ? ` (${p.sku})` : ""}${extra ? ` — ${extra}` : ""}. ${url}`;
  const wa = whatsappUrl(useSiteInfo.getState().whatsapp, text);
  if (wa) {
    trackLead("whatsapp");
    window.open(wa, "_blank", "noopener,noreferrer");
  }
  else window.location.assign(`/products/${p.slug}#enquire`);
}
