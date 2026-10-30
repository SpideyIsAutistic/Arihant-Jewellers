import fs from "fs";
import path from "path";
import type { Banner, Category, Collection, Offer, Product, Review, Testimonial } from "@/db/schema";
import type { MetalRates } from "./gold-rates";
import { DEFAULT_METAL_RATES } from "./gold-rates";
import { DEFAULT_SETTINGS, type StoreSettings } from "./settings";
import { isOfferLive, matchesCollection, priceProduct } from "./pricing";
import { isTemplateCopy, splitList } from "./utils";
import type { ProductCard, Listing } from "./catalog";

export type ServerSiteData = {
  products: Product[];
  categories: Category[];
  collections: Collection[];
  offers: Offer[];
  banners: Banner[];
  testimonials: Testimonial[];
  reviews: Review[];
  settings: Record<string, unknown>;
  metalRates: Partial<MetalRates> | null;
};

export type ServerCatalogData = {
  cards: ProductCard[];
  categories: Category[];
  collections: Collection[];
  offers: Offer[];
  metalRates: MetalRates;
};

function revive<T>(v: T): T {
  if (Array.isArray(v)) return v.map(revive) as T;
  if (v && typeof v === "object" && !(v instanceof Date)) {
    const out: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v)) {
      out[k] = k.endsWith("At") && typeof x === "number" ? new Date(x) : revive(x);
    }
    return out as T;
  }
  return v;
}

/** Until the admin applies the rewritten descriptions, use them from the seed for products still on the first template. */
function withRewrittenCopy(products: Product[], root: string): Product[] {
  try {
    const seed = JSON.parse(fs.readFileSync(path.join(root, "public", "seed", "catalog.json"), "utf-8")).products as Product[];
    const byId = new Map(seed.map((p) => [p.id, p]));
    return products.map((p) => {
      const s = byId.get(p.id);
      return s && isTemplateCopy(p)
        ? { ...p, description: s.description, seoDescription: p.seoDescription || s.seoDescription }
        : p;
    });
  } catch {
    return products;
  }
}

let cachedSiteData: ServerSiteData | null = null;

export function getServerSiteData(): ServerSiteData {
  if (cachedSiteData) return cachedSiteData;

  const root = process.cwd();
  // Live copy from scripts/pull-live.mjs when present; otherwise the starter seed (emulator/offline builds).
  const live = fs.existsSync(path.join(root, "data", "live", "catalog.json"));
  const dir = live ? path.join(root, "data", "live") : path.join(root, "public", "seed");
  const catalogPath = path.join(dir, "catalog.json");
  const contentPath = path.join(dir, "content.json");

  let products: Product[] = [];
  if (fs.existsSync(catalogPath)) {
    try {
      const cat = JSON.parse(fs.readFileSync(catalogPath, "utf-8"));
      products = revive(cat.products || []);
      if (live) products = withRewrittenCopy(products, root);
    } catch (err) {
      console.error("Failed to read public/seed/catalog.json:", err);
    }
  }

  let content: Partial<ServerSiteData> = {};
  if (fs.existsSync(contentPath)) {
    try {
      const con = JSON.parse(fs.readFileSync(contentPath, "utf-8"));
      content = revive(con);
    } catch (err) {
      console.error("Failed to read public/seed/content.json:", err);
    }
  }

  cachedSiteData = {
    products,
    categories: content.categories || [],
    collections: content.collections || [],
    offers: content.offers || [],
    banners: content.banners || [],
    testimonials: content.testimonials || [],
    reviews: content.reviews || [],
    settings: content.settings || {},
    metalRates: content.metalRates || null,
  };

  return cachedSiteData;
}

function aggregateReviews(reviews: Review[]) {
  const m = new Map<string, { productId: string; avg: number; count: number }>();
  for (const r of reviews) {
    const e = m.get(r.productId) ?? { productId: r.productId, avg: 0, count: 0 };
    e.avg = (e.avg * e.count + r.rating) / (e.count + 1);
    e.count++;
    m.set(r.productId, e);
  }
  return [...m.values()];
}

let cachedCatalog: ServerCatalogData | null = null;

export function getServerCatalog(): ServerCatalogData {
  if (cachedCatalog) return cachedCatalog;

  const site = getServerSiteData();
  const metalRates: MetalRates = { ...DEFAULT_METAL_RATES, ...(site.metalRates ?? {}) };

  const rows = site.products
    .filter((p) => p.isActive)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map((p) => ({ ...p, category: site.categories.find((c) => c.id === p.categoryId) ?? null }));

  const categories = site.categories.filter((c) => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const collections = site.collections.filter((c) => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const offers = site.offers;
  const ratingRows = aggregateReviews(site.reviews.filter((r) => r.isApproved));
  const liveOffers = offers.filter((o) => isOfferLive(o));
  const collectionsById = new Map(collections.map((c) => [c.id, c]));
  const ratings = new Map(ratingRows.map((r) => [r.productId, { avg: Number(r.avg), count: Number(r.count) }]));

  const cards: ProductCard[] = rows.map((p, i) => {
    const info = priceProduct(p, liveOffers, collectionsById, 0, metalRates);
    const stock = p.variants.reduce((s, v) => s + Math.max(0, v.stock), 0);
    const firstInStock = p.variants.find((v) => v.stock > 0) ?? p.variants[0];
    return {
      id: p.id,
      slug: p.slug,
      sku: p.sku,
      name: p.name,
      image: p.images[0]?.url ?? null,
      imageAlt: p.images[0]?.alt || p.name,
      image2: p.images[1]?.url ?? null,
      price: info.price,
      compareAt: info.compareAt,
      discountPct: info.discountPct,
      rating: ratings.get(p.id) ?? null,
      inStock: stock > 0,
      variantCount: p.variants.length,
      defaultVariantId: firstInStock?.id ?? null,
      defaultVariantTitle: firstInStock?.title ?? null,
      categoryId: p.categoryId,
      categoryName: p.category?.name ?? null,
      categorySlug: p.category?.slug ?? null,
      metal: p.metal,
      purity: p.purity ?? null,
      weightGrams: p.weightGrams ?? null,
      finish: p.finish,
      gender: p.gender,
      tags: splitList(p.tags),
      createdAt: p.createdAt.getTime(),
      position: i,
    };
  });

  cachedCatalog = { cards, categories, collections, offers: liveOffers, metalRates };
  return cachedCatalog;
}

export function getAllProductSlugs(): string[] {
  const site = getServerSiteData();
  return site.products.filter((p) => p.isActive).map((p) => p.slug);
}

export function getAllCollectionSlugs(): string[] {
  const site = getServerSiteData();
  const catSlugs = site.categories.filter((c) => c.isActive).map((c) => c.slug);
  const colSlugs = site.collections.filter((c) => c.isActive).map((c) => c.slug);
  return ["all", ...new Set([...catSlugs, ...colSlugs])];
}

function rank(list: string[], id: string) {
  const i = list.indexOf(id);
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
}

export function getServerListing(slug: string): Listing | null {
  const { cards, categories, collections } = getServerCatalog();
  if (slug === "all") {
    return {
      kind: "all",
      slug,
      title: "All Jewellery",
      description:
        "Explore every piece in the Arihant Jewellers collection — gold, diamond, gemstone and silver jewellery for everyday wear, gifting and celebrations.",
      heroImage: null,
      items: cards,
    };
  }
  const cat = categories.find((c) => c.slug === slug);
  if (cat) {
    return {
      kind: "category",
      slug,
      title: cat.name,
      description: cat.description,
      heroImage: cat.heroImage ?? cat.image,
      startingFrom: cat.startingFrom ?? null,
      seoTitle: cat.seoTitle,
      seoDescription: cat.seoDescription,
      items: cards.filter((c) => c.categoryId === cat.id),
    };
  }
  const col = collections.find((c) => c.slug === slug);
  if (col) {
    const items = cards.filter((card) =>
      matchesCollection(
        { id: card.id, price: card.price, compareAtPrice: card.compareAt, categoryId: card.categoryId, metal: card.metal, tags: card.tags.join(",") },
        col,
        card.price,
        card.discountPct > 0,
      ),
    );
    const manual = splitList(col.productIds);
    if (manual.length) items.sort((a, b) => rank(manual, a.id) - rank(manual, b.id));
    return {
      kind: "collection",
      slug,
      title: col.title,
      description: col.description,
      heroImage: col.heroImage ?? col.image,
      seoTitle: col.seoTitle,
      seoDescription: col.seoDescription,
      items,
    };
  }
  return null;
}

export function getServerProductBySlug(slug: string) {
  const site = getServerSiteData();
  const p = site.products.find((x) => x.slug === slug && x.isActive);
  if (!p) return null;
  const product: Product & { category: Category | null } = {
    ...p,
    category: site.categories.find((c) => c.id === p.categoryId) ?? null,
  };
  const { offers, collections, cards, metalRates } = getServerCatalog();
  const collectionsById = new Map(collections.map((c) => [c.id, c]));
  const variantPrices = product.variants.map((v) => ({
    ...v,
    ...priceProduct(product, offers, collectionsById, v.priceDelta, metalRates),
  }));
  const card = cards.find((c) => c.id === product.id) ?? {
    id: product.id,
    slug: product.slug,
    sku: product.sku,
    name: product.name,
    image: product.images[0]?.url ?? null,
    imageAlt: product.images[0]?.alt || product.name,
    image2: product.images[1]?.url ?? null,
    price: product.price,
    compareAt: product.compareAtPrice,
    discountPct: 0,
    rating: null,
    inStock: true,
    variantCount: product.variants.length,
    defaultVariantId: product.variants[0]?.id ?? null,
    defaultVariantTitle: product.variants[0]?.title ?? null,
    categoryId: product.categoryId,
    categoryName: product.category?.name ?? null,
    categorySlug: product.category?.slug ?? null,
    metal: product.metal,
    purity: product.purity ?? null,
    weightGrams: product.weightGrams ?? null,
    finish: product.finish,
    gender: product.gender,
    tags: splitList(product.tags),
    createdAt: product.createdAt.getTime(),
    position: 0,
  };
  const reviews = site.reviews
    .filter((r) => r.productId === product.id && r.isApproved)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const related = cards
    .filter((c) => c.id !== product.id && (c.categoryId === product.categoryId || c.metal === product.metal))
    .sort((a, b) => Number(b.categoryId === product.categoryId) - Number(a.categoryId === product.categoryId))
    .slice(0, 10);
  return { product, variants: variantPrices, card, reviews, related, metalRates };
}

export function getServerSettings(): StoreSettings {
  const site = getServerSiteData();
  const s = site.settings as Partial<StoreSettings>;
  return {
    ...DEFAULT_SETTINGS,
    ...s,
    social: { ...DEFAULT_SETTINGS.social, ...(s.social ?? {}) },
    policies: { ...DEFAULT_SETTINGS.policies, ...(s.policies ?? {}) },
  };
}

export type HomeData = [
  Record<Banner["placement"], Banner[]>,
  StoreSettings,
  ServerCatalogData,
  ProductCard[],
  ProductCard[],
  { category: Category; from: number | null; count: number }[],
  Testimonial[],
];

export function getServerHomeData(): HomeData {
  const site = getServerSiteData();
  const catalog = getServerCatalog();
  const settings = getServerSettings();

  const banners = { hero: [], promo: [], collections: [], recipient: [], occasion: [], category: [], look: [], instagram: [] } as Record<
    Banner["placement"],
    Banner[]
  >;
  const bannerRows = site.banners.filter((b) => b.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  for (const r of bannerRows) banners[r.placement]?.push(r);

  const bestsellers = catalog.cards.filter((c) => c.tags.includes("bestseller")).slice(0, 40);
  const taggedNew = catalog.cards.filter((c) => c.tags.includes("new"));
  const newArrivals = (taggedNew.length >= 4 ? taggedNew : [...catalog.cards].sort((a, b) => b.createdAt - a.createdAt)).slice(0, 12);

  const catPrices = catalog.categories.map((cat) => {
    const prices = catalog.cards.filter((c) => c.categoryId === cat.id).map((c) => c.price);
    const priced = prices.filter((p) => p > 0); // "price on request" is 0
    return { category: cat, from: cat.startingFrom || (priced.length ? Math.min(...priced) : null), count: prices.length };
  });

  const testimonials = site.testimonials.filter((t) => t.isActive).sort((a, b) => a.sortOrder - b.sortOrder);

  return [banners, settings, catalog, bestsellers, newArrivals, catPrices, testimonials];
}

