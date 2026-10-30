/**
 * Data shapes stored in Firestore (see src/lib/data.ts).
 * Kept at this path so existing `import type { … } from "@/db/schema"` lines keep working.
 * Money is in paise. Dates are stored as epoch ms and turned into Date objects on load.
 */

export type Banner = {
  id: string;
  placement: "hero" | "promo" | "collections" | "recipient" | "occasion" | "category" | "look" | "instagram";
  title: string | null;
  subtitle: string | null;
  ctaLabel: string | null;
  href: string | null;
  image: string;
  mobileImage: string | null;
  align: "left" | "center" | "right";
  theme: "dark" | "light";
  meta: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  heroImage: string | null;
  sortOrder: number;
  isActive: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  /** "Starting from" price in paise, set by the admin; null = work it out from priced products. */
  startingFrom?: number | null;
  createdAt: Date;
};

export type Collection = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image: string | null;
  heroImage: string | null;
  ruleTag: string | null;
  ruleMetal: string | null;
  ruleCategoryId: string | null;
  ruleMinPrice: number | null;
  ruleMaxPrice: number | null;
  ruleOnSale: boolean;
  productIds: string | null;
  sortOrder: number;
  isActive: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date;
};

export type Offer = {
  id: string;
  name: string;
  kind: "percent" | "flat";
  value: number;
  appliesTo: "all" | "category" | "collection" | "metal" | "products";
  target: string | null;
  startsAt: Date | null;
  endsAt: Date | null;
  isActive: boolean;
  createdAt: Date;
};

export type ProductImage = { url: string; alt: string | null };

export type Variant = {
  id: string;
  title: string;
  sku: string | null;
  priceDelta: number;
  stock: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string | null;
  description: string;
  metal: string;
  purity: string | null;
  finish: string | null;
  gender: string;
  stone: string | null;
  weightGrams: number | null;
  /** Making charges as % of metal value. With weightGrams set, the price follows the saved gold/silver rate. */
  makingPct?: number | null;
  /** Diamonds/gemstones value in paise, added to the metal + making (before GST). */
  stoneValue?: number | null;
  dimensions: string | null;
  /** 0 = "Price on request" */
  price: number;
  compareAtPrice: number | null;
  tags: string;
  isActive: boolean;
  isSample: boolean;
  careInstructions: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  images: ProductImage[];
  variants: Variant[];
  createdAt: Date;
  updatedAt: Date;
};

export type Review = {
  id: string;
  productId: string;
  name: string;
  email: string | null;
  rating: number;
  title: string | null;
  body: string;
  isApproved: boolean;
  createdAt: Date;
};

export type Testimonial = {
  id: string;
  name: string;
  location: string | null;
  quote: string;
  avatar: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
};

export type Subscriber = { id: string; email: string; createdAt: Date };
