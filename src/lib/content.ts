import type { Banner } from "@/db/schema";
import { loadSite } from "./data";

export async function getBanners(): Promise<Record<Banner["placement"], Banner[]>> {
  const site = await loadSite();
  const rows = site.banners.filter((b) => b.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const out = { hero: [], promo: [], collections: [], recipient: [], occasion: [], category: [], look: [], instagram: [] } as Record<
    Banner["placement"],
    Banner[]
  >;
  for (const r of rows) out[r.placement]?.push(r);
  return out;
}

export async function getTestimonials() {
  const site = await loadSite();
  return site.testimonials.filter((t) => t.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
}
