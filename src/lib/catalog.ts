import type { Category, Collection, Offer, Product, Review } from "@/db/schema";
import { matchesCollection, priceProduct, isOfferLive } from "./pricing";
import { splitList } from "./utils";
import { getMetalRates, type MetalRates } from "./gold-rates";
import { loadSite } from "./data";

export type ProductCard = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  image: string | null;
  imageAlt: string;
  image2: string | null;
  price: number;
  compareAt: number | null;
  discountPct: number;
  rating: { avg: number; count: number } | null;
  inStock: boolean;
  variantCount: number;
  defaultVariantId: string | null;
  defaultVariantTitle: string | null;
  categoryId: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  metal: string;
  purity: string | null;
  weightGrams: number | null;
  finish: string | null;
  gender: string;
  tags: string[];
  createdAt: number;
  position: number;
};

type CatalogData = {
  cards: ProductCard[];
  categories: Category[];
  collections: Collection[];
  offers: Offer[];
  metalRates: MetalRates;
};

let built: { from: unknown; data: Promise<CatalogData> } | null = null;

/** Builds the active catalogue (prices resolved against live offers & metal rates) once per site load. */
export function getCatalog(): Promise<CatalogData> {
  const site = loadSite();
  if (built?.from !== site) built = { from: site, data: site.then(build) };
  return built.data;
}

async function build(site: Awaited<ReturnType<typeof loadSite>>): Promise<CatalogData> {
  const metalRates = await getMetalRates();
  const rows = site.products
    .filter((p) => p.isActive)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map((p) => ({ ...p, category: site.categories.find((c) => c.id === p.categoryId) ?? null }));
  const categories = site.categories.filter((c) => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const collections = site.collections.filter((c) => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const offers = site.offers;
  const ratingRows = aggregate(site.reviews.filter((r) => r.isApproved));
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

  return { cards, categories, collections, offers: liveOffers, metalRates };
}

function aggregate(reviews: Review[]) {
  const m = new Map<string, { productId: string; avg: number; count: number }>();
  for (const r of reviews) {
    const e = m.get(r.productId) ?? { productId: r.productId, avg: 0, count: 0 };
    e.avg = (e.avg * e.count + r.rating) / (e.count + 1);
    e.count++;
    m.set(r.productId, e);
  }
  return [...m.values()];
}

/* ───────────────────────── Listings ───────────────────────── */

export type Listing = {
  kind: "all" | "category" | "collection" | "search";
  slug: string;
  title: string;
  description: string | null;
  heroImage: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  startingFrom?: number | null;
  items: ProductCard[];
};

export async function resolveListing(slug: string): Promise<Listing | null> {
  const { cards, categories, collections } = await getCatalog();
  if (slug === "all" || slug === "catalogue") {
    return {
      kind: "all",
      slug,
      title: "All Jewellery Catalogue",
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

function rank(list: string[], id: string) {
  const i = list.indexOf(id);
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
}

/* ───────────────────────── Filtering ───────────────────────── */

export const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "discount", label: "Discount: High to Low" },
] as const;

export const DISCOUNT_BUCKETS = [50, 40, 30, 20] as const;

export type FilterParams = {
  category: string[];
  metal: string[];
  finish: string[];
  gender: string[];
  min: number | null; // rupees
  max: number | null; // rupees
  discount: number | null;
  sort: string;
  q: string;
};

export function parseFilterParams(sp: Record<string, string | string[] | undefined>): FilterParams {
  const list = (k: string) => {
    const v = sp[k];
    const s = Array.isArray(v) ? v.join(",") : v;
    return splitList(s);
  };
  const num = (k: string) => {
    const v = sp[k];
    const n = parseInt(Array.isArray(v) ? v[0] : (v ?? ""), 10);
    return Number.isFinite(n) ? n : null;
  };
  const sortRaw = (Array.isArray(sp.sort) ? sp.sort[0] : sp.sort) ?? "relevance";
  return {
    category: list("category"),
    metal: list("metal"),
    finish: list("finish"),
    gender: list("gender"),
    min: num("min"),
    max: num("max"),
    discount: num("discount"),
    sort: SORT_OPTIONS.some((o) => o.value === sortRaw) ? sortRaw : "relevance",
    q: ((Array.isArray(sp.q) ? sp.q[0] : sp.q) ?? "").trim().slice(0, 60),
  };
}

type FacetKey = "category" | "metal" | "finish" | "gender" | "price" | "discount";

function passes(card: ProductCard, f: FilterParams, skip?: FacetKey) {
  if (f.q) {
    const hay = `${card.name} ${card.tags.join(" ")} ${card.finish ?? ""}`.toLowerCase();
    if (!f.q.toLowerCase().split(/\s+/).every((t) => hay.includes(t.replace(/(es|s)$/, "")))) return false;
  }
  if (skip !== "category" && f.category.length && !f.category.includes(card.categorySlug ?? "")) return false;
  if (skip !== "metal" && f.metal.length && !f.metal.includes(card.metal)) return false;
  if (skip !== "finish" && f.finish.length && !f.finish.includes(card.finish ?? "")) return false;
  if (skip !== "gender" && f.gender.length && !f.gender.includes(card.gender)) return false;
  if (skip !== "price") {
    if (f.min != null && card.price < f.min * 100) return false;
    if (f.max != null && card.price > f.max * 100) return false;
  }
  if (skip !== "discount" && f.discount != null && card.discountPct < f.discount) return false;
  return true;
}

export type FacetOption = { value: string; label: string; count: number };
export type Facets = {
  category: FacetOption[];
  metal: FacetOption[];
  finish: FacetOption[];
  gender: FacetOption[];
  discount: FacetOption[];
  priceRange: { min: number; max: number }; // rupees
};

function countBy(items: ProductCard[], key: (c: ProductCard) => string | null, label?: (v: string) => string) {
  const m = new Map<string, number>();
  for (const it of items) {
    const v = key(it);
    if (!v) continue;
    m.set(v, (m.get(v) ?? 0) + 1);
  }
  return [...m.entries()]
    .map(([value, count]) => ({ value, label: label ? label(value) : value, count }))
    .sort((a, b) => b.count - a.count);
}

export function applyFilters(base: ProductCard[], f: FilterParams) {
  const items = base.filter((c) => passes(c, f));
  const sorted = sortCards(items, f.sort);
  const catNames = new Map(base.map((c) => [c.categorySlug ?? "", c.categoryName ?? ""]));
  const prices = base.map((c) => c.price / 100);
  const facets: Facets = {
    category: countBy(base.filter((c) => passes(c, f, "category")), (c) => c.categorySlug, (v) => catNames.get(v) ?? v),
    metal: countBy(base.filter((c) => passes(c, f, "metal")), (c) => c.metal),
    finish: countBy(base.filter((c) => passes(c, f, "finish")), (c) => c.finish),
    gender: countBy(base.filter((c) => passes(c, f, "gender")), (c) => c.gender),
    discount: (() => {
      const pool = base.filter((c) => passes(c, f, "discount"));
      return DISCOUNT_BUCKETS.map((d) => ({
        value: String(d),
        label: `${d}% or more`,
        count: pool.filter((c) => c.discountPct >= d).length,
      })).filter((o) => o.count > 0);
    })(),
    priceRange: {
      min: prices.length ? Math.floor(Math.min(...prices)) : 0,
      max: prices.length ? Math.ceil(Math.max(...prices)) : 0,
    },
  };
  return { items: sorted, facets };
}

export function sortCards(items: ProductCard[], sort: string) {
  const arr = [...items];
  switch (sort) {
    case "none":
      return arr;
    case "newest":
      return arr.sort((a, b) => b.createdAt - a.createdAt);
    case "oldest":
      return arr.sort((a, b) => a.createdAt - b.createdAt);
    case "price-asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price-desc":
      return arr.sort((a, b) => b.price - a.price);
    case "discount":
      return arr.sort((a, b) => b.discountPct - a.discountPct);
    default:
      // relevance: in-stock first, bestsellers first, then catalogue order
      return arr.sort(
        (a, b) =>
          Number(b.inStock) - Number(a.inStock) ||
          Number(b.tags.includes("bestseller")) - Number(a.tags.includes("bestseller")) ||
          a.position - b.position,
      );
  }
}

/* ───────────────────────── Search ───────────────────────── */

export async function searchCatalog(query: string) {
  const { cards, categories } = await getCatalog();
  const q = query.trim().toLowerCase();
  if (!q) return { items: [] as ProductCard[], categories: [] as Category[] };
  const tokens = q.split(/\s+/).filter(Boolean);
  const esc = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const scored = cards
    .map((c) => {
      const hay = {
        name: c.name.toLowerCase(),
        cat: (c.categoryName ?? "").toLowerCase(),
        other: [c.metal, c.finish ?? "", c.gender, c.sku, ...c.tags].join(" ").toLowerCase(),
      };
      let score = 0;
      for (const t of tokens) {
        const stem = t.length > 3 ? t.replace(/(es|s)$/, "") : t;
        const wordStart = new RegExp(`(^|[^a-z])${esc(stem)}`);
        if (wordStart.test(hay.name)) score += 6;
        else if (wordStart.test(hay.cat)) score += 5;
        else if (hay.name.includes(stem)) score += 2;
        else if (wordStart.test(hay.other)) score += 1;
        else return { c, score: 0 };
      }
      if (hay.name.startsWith(q)) score += 3;
      return { c, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.c.position - b.c.position)
    .map((s) => s.c);
  const cats = categories.filter((c) =>
    tokens.some((t) => new RegExp(`(^|[^a-z])${esc(t.length > 3 ? t.replace(/(es|s)$/, "") : t)}`).test(c.name.toLowerCase())),
  );
  return { items: scored, categories: cats };
}

/* ───────────────────────── Lookups ───────────────────────── */

export async function getCardsByIds(ids: string[]) {
  const { cards } = await getCatalog();
  const m = new Map(cards.map((c) => [c.id, c]));
  return ids.map((id) => m.get(id)).filter(Boolean) as ProductCard[];
}

export async function getCardsByTag(tag: string, limit = 12) {
  const { cards } = await getCatalog();
  return cards.filter((c) => c.tags.includes(tag)).slice(0, limit);
}

export async function getNewArrivals(limit = 12) {
  const { cards } = await getCatalog();
  const tagged = cards.filter((c) => c.tags.includes("new"));
  return (tagged.length >= 4 ? tagged : sortCards(cards, "newest")).slice(0, limit);
}

export async function getCategoryStartingPrices() {
  const { cards, categories } = await getCatalog();
  return categories.map((cat) => {
    const prices = cards.filter((c) => c.categoryId === cat.id).map((c) => c.price);
    const priced = prices.filter((p) => p > 0); // "price on request" is 0
    return { category: cat, from: cat.startingFrom || (priced.length ? Math.min(...priced) : null), count: prices.length };
  });
}

export async function getProductBySlug(slug: string) {
  const site = await loadSite();
  const p = site.products.find((x) => x.slug === slug && x.isActive);
  if (!p) return null;
  const product: Product & { category: Category | null } = { ...p, category: site.categories.find((c) => c.id === p.categoryId) ?? null };
  const { offers, collections, cards, metalRates } = await getCatalog();
  const collectionsById = new Map(collections.map((c) => [c.id, c]));
  const variantPrices = product.variants.map((v) => ({
    ...v,
    ...priceProduct(product, offers, collectionsById, v.priceDelta, metalRates),
  }));
  const card = cards.find((c) => c.id === product.id)!;
  const reviews = site.reviews
    .filter((r) => r.productId === product.id && r.isApproved)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const related = cards
    .filter((c) => c.id !== product.id && (c.categoryId === product.categoryId || c.metal === product.metal))
    .sort((a, b) => Number(b.categoryId === product.categoryId) - Number(a.categoryId === product.categoryId))
    .slice(0, 10);
  return { product, variants: variantPrices, card, reviews, related, metalRates };
}
