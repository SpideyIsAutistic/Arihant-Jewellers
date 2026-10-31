"use client";

import { doc, getDoc, runTransaction } from "firebase/firestore";
import { db } from "./firebase";
import type { Banner, Category, Collection, Offer, Product, Review, Testimonial } from "@/db/schema";
import type { MetalRates } from "./gold-rates";

/**
 * The whole public site lives in two Firestore documents so a visit costs ~2 reads
 * (the free Spark plan allows 50k reads/day):
 *   site/catalog  → { products: Product[] }
 *   site/content  → { categories, collections, offers, banners, testimonials, reviews (approved), settings, metalRates }
 * shortcut: a Firestore doc caps at 1 MB (~500 products here); split site/catalog into pages if the catalogue outgrows it.
 */
export type CatalogDoc = { products: Product[] };
export type ContentDoc = {
  categories: Category[];
  collections: Collection[];
  offers: Offer[];
  banners: Banner[];
  testimonials: Testimonial[];
  reviews: Review[];
  settings: Record<string, unknown>;
  metalRates: Partial<MetalRates> | null;
};
export type SiteData = CatalogDoc & ContentDoc;

const EMPTY_CONTENT: ContentDoc = {
  categories: [],
  collections: [],
  offers: [],
  banners: [],
  testimonials: [],
  reviews: [],
  settings: {},
  metalRates: null,
};

/** Firestore stores dates as epoch ms; any `…At` number becomes a Date again. */
export function revive<T>(v: T): T {
  if (Array.isArray(v)) return v.map(revive) as T;
  if (v && typeof v === "object" && !(v instanceof Date)) {
    const out: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v)) out[k] = k.endsWith("At") && typeof x === "number" ? new Date(x) : revive(x);
    return out as T;
  }
  return v;
}

export function serialize<T>(v: T): T {
  if (v instanceof Date) return v.getTime() as T;
  if (Array.isArray(v)) return v.map(serialize) as T;
  if (v && typeof v === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v)) if (x !== undefined) out[k] = serialize(x);
    return out as T;
  }
  return v;
}

let pending: Promise<SiteData> | null = null;

/** Loads the site once per page view (shared by every component). */
export function loadSite(fresh = false): Promise<SiteData> {
  if (!pending || fresh) {
    pending = Promise.all([getDoc(doc(db(), "site", "catalog")), getDoc(doc(db(), "site", "content"))])
      .then(([cat, con]) => ({
        products: revive((cat.data()?.products as Product[]) ?? []),
        ...EMPTY_CONTENT,
        ...revive((con.data() as Partial<ContentDoc>) ?? {}),
      }))
      .catch((e) => {
        pending = null;
        throw e;
      });
  }
  return pending;
}

/** Atomically edits one site document (admins only — enforced by firestore.rules). */
export async function mutateCatalog(fn: (d: CatalogDoc) => void | string) {
  return mutate("catalog", { products: [] }, fn);
}
export async function mutateContent(fn: (d: ContentDoc) => void | string) {
  return mutate("content", EMPTY_CONTENT, fn);
}

async function mutate<T extends object>(name: string, empty: T, fn: (d: T) => void | string): Promise<string | null> {
  const ref = doc(db(), "site", name);
  const err = await runTransaction(db(), async (tx) => {
    const snap = await tx.get(ref);
    const data = { ...structuredClone(empty), ...revive((snap.data() as Partial<T>) ?? {}) } as T;
    const problem = fn(data);
    if (typeof problem === "string") return problem;
    tx.set(ref, serialize(data));
    return null;
  });
  if (!err) {
    pending = null; // next read sees the change
    if (typeof window !== "undefined") window.dispatchEvent(new Event("aj:data"));
  }
  return err;
}

export const newId = () => crypto.randomUUID();
