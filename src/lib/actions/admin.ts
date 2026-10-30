"use client";

import { z } from "zod";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { mutateCatalog, mutateContent, newId, revive } from "@/lib/data";
import { rupeesToPaise } from "@/lib/format";
import { isTemplateCopy, slugify, toE164 } from "@/lib/utils";
import { compressImage } from "@/lib/image";
import { saveSettings, getRawSettings, type StoreSettings, type TrustItem } from "@/lib/settings";
import { saveMetalRates, fetchLiveMarketRates } from "@/lib/gold-rates";
import { DEFAULT_POLICIES, type PolicySlug } from "@/lib/policies";
import type { Banner, Category, Collection, Offer, Product, Review, Testimonial, Variant } from "@/db/schema";
import type { FormState } from "./store";

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const opt = (f: FormData, k: string) => str(f, k) || null;
const bool = (f: FormData, k: string) => f.get(k) === "on" || f.get(k) === "true";
const int = (f: FormData, k: string, d = 0) => {
  const n = parseInt(str(f, k), 10);
  return Number.isFinite(n) ? n : d;
};
const paise = (f: FormData, k: string) => (str(f, k) === "" ? null : rupeesToPaise(str(f, k)));
const date = (f: FormData, k: string) => {
  const v = str(f, k);
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};
const fail = (message: string): FormState => ({ ok: false, message });
const done = (message = "Saved."): FormState => ({ ok: true, message });
const go = (path: string) => window.location.assign(path);

/** Turns a rejected write (e.g. not an admin) into a readable form message. */
async function guard(fn: () => Promise<FormState>): Promise<FormState> {
  try {
    return await fn();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return fail(/permission|insufficient/i.test(msg) ? "You don't have permission to make changes. Sign in with an admin Google account." : `Couldn't save: ${msg}`);
  }
}
const run = (fn: () => Promise<unknown>) => fn().catch((e) => alert(e instanceof Error ? e.message : String(e)));

/** Removes one item by id from an array in place. */
function drop<T extends { id: string }>(arr: T[], id: string) {
  const i = arr.findIndex((x) => x.id === id);
  if (i >= 0) arr.splice(i, 1);
}
function upsert<T extends { id: string }>(arr: T[], id: string | null, values: Omit<T, "id" | "createdAt">): string {
  const now = new Date();
  if (id) {
    const i = arr.findIndex((x) => x.id === id);
    if (i >= 0) {
      arr[i] = { ...arr[i], ...values };
      return id;
    }
  }
  const nid = newId();
  arr.push({ ...(values as T), id: nid, createdAt: now });
  return nid;
}

/* ───────── Auth ───────── */

export async function adminLogout() {
  await signOut(auth());
  go("/admin");
}

/* ───────── Products ───────── */

const productSchema = z.object({
  name: z.string().min(2, "Name is required").max(160),
  sku: z.string().min(2, "SKU is required").max(60),
  price: z.number().int().min(0, "Price can't be negative"),
});

export async function saveProduct(_: FormState, form: FormData): Promise<FormState> {
  return guard(async () => {
    const id = opt(form, "id");
    const name = str(form, "name");
    const price = paise(form, "price") ?? 0;
    const parsed = productSchema.safeParse({ name, sku: str(form, "sku"), price });
    if (!parsed.success) return fail(parsed.error.issues[0].message);
    const slug = slugify(str(form, "slug") || name);
    if (!slug) return fail("Slug is invalid.");

    const tags = [...form.getAll("tag").map(String), ...str(form, "extraTags").split(",")].map((t) => slugify(t)).filter(Boolean);
    const images = str(form, "images")
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s.startsWith("https://") || s.startsWith("/") || s.startsWith("media:"))
      .map((url, i) => ({ url, alt: i === 0 ? name : `${name} — view ${i + 1}` }));

    const vIds = form.getAll("v_id").map(String);
    const vTitles = form.getAll("v_title").map(String);
    const vSkus = form.getAll("v_sku").map(String);
    const vDeltas = form.getAll("v_delta").map(String);
    const vStocks = form.getAll("v_stock").map(String);
    const variants: Variant[] = vTitles
      .map((t, i) => ({
        id: vIds[i] || newId(),
        title: t.trim() || "Default",
        sku: vSkus[i]?.trim() || null,
        priceDelta: rupeesToPaise(vDeltas[i] || "0"),
        stock: Math.max(0, parseInt(vStocks[i] || "0", 10) || 0),
      }))
      .filter((_, i) => vTitles[i].trim() !== "" || vTitles.length === 1);
    if (!variants.length) variants.push({ id: newId(), title: "Default", sku: null, priceDelta: 0, stock: 1 });

    let productId = id;
    const err = await mutateCatalog((d) => {
      if (d.products.some((p) => p.slug === slug && p.id !== id)) return "Another product already uses this URL slug.";
      if (d.products.some((p) => p.sku === parsed.data.sku && p.id !== id)) return "Another product already uses this SKU.";
      const now = new Date();
      const values = {
        name,
        slug,
        sku: parsed.data.sku,
        categoryId: opt(form, "categoryId"),
        description: str(form, "description"),
        metal: str(form, "metal") || "Silver",
        purity: opt(form, "purity"),
        finish: opt(form, "finish"),
        gender: str(form, "gender") || "Women",
        stone: opt(form, "stone"),
        weightGrams: str(form, "weightGrams") ? parseFloat(str(form, "weightGrams")) : null,
        makingPct: str(form, "makingPct") ? Math.max(0, parseFloat(str(form, "makingPct"))) : null,
        stoneValue: paise(form, "stoneValue"),
        dimensions: opt(form, "dimensions"),
        price,
        compareAtPrice: paise(form, "compareAtPrice"),
        tags: [...new Set(tags)].join(","),
        isActive: bool(form, "isActive"),
        isSample: bool(form, "isSample"),
        careInstructions: opt(form, "careInstructions"),
        seoTitle: opt(form, "seoTitle"),
        seoDescription: opt(form, "seoDescription"),
        images,
        variants,
        updatedAt: now,
      };
      productId = upsert<Product>(d.products, id, values);
    });
    if (err) return fail(err);
    if (!id) go(`/admin/products/edit?id=${productId}&saved=1`);
    return done("Product saved.");
  });
}

export async function deleteProduct(form: FormData) {
  await run(() => mutateCatalog((d) => drop(d.products, str(form, "id"))));
  go("/admin/products");
}

export async function toggleProduct(form: FormData) {
  await run(() =>
    mutateCatalog((d) => {
      const p = d.products.find((x) => x.id === str(form, "id"));
      if (p) p.isActive = !p.isActive;
    }),
  );
}

/* ───────── Categories ───────── */

export async function saveCategory(_: FormState, form: FormData): Promise<FormState> {
  return guard(async () => {
    const id = opt(form, "id");
    const name = str(form, "name");
    if (name.length < 2) return fail("Name is required.");
    const slug = slugify(str(form, "slug") || name);
    const err = await mutateContent((d) => {
      if (slug === "all" || d.categories.some((c) => c.slug === slug && c.id !== id) || d.collections.some((c) => c.slug === slug))
        return "This URL slug is already used by a category or collection.";
      upsert<Category>(d.categories, id, {
        name,
        slug,
        description: opt(form, "description"),
        image: opt(form, "image"),
        heroImage: opt(form, "heroImage"),
        sortOrder: int(form, "sortOrder"),
        isActive: bool(form, "isActive"),
        seoTitle: opt(form, "seoTitle"),
        seoDescription: opt(form, "seoDescription"),
        startingFrom: paise(form, "startingFrom"),
      });
    });
    if (err) return fail(err);
    if (!id) go("/admin/categories");
    return done("Category saved.");
  });
}

export async function deleteCategory(form: FormData) {
  await run(() => mutateContent((d) => drop(d.categories, str(form, "id"))));
  go("/admin/categories");
}

/* ───────── Collections ───────── */

export async function saveCollection(_: FormState, form: FormData): Promise<FormState> {
  return guard(async () => {
    const id = opt(form, "id");
    const title = str(form, "title");
    if (title.length < 2) return fail("Title is required.");
    const slug = slugify(str(form, "slug") || title);
    const err = await mutateContent((d) => {
      if (slug === "all" || d.collections.some((c) => c.slug === slug && c.id !== id) || d.categories.some((c) => c.slug === slug))
        return "This URL slug is already used by a category or collection.";
      upsert<Collection>(d.collections, id, {
        title,
        slug,
        description: opt(form, "description"),
        image: opt(form, "image"),
        heroImage: opt(form, "heroImage"),
        ruleTag: opt(form, "ruleTag") ? slugify(str(form, "ruleTag")) : null,
        ruleMetal: opt(form, "ruleMetal"),
        ruleCategoryId: opt(form, "ruleCategoryId"),
        ruleMinPrice: paise(form, "ruleMinPrice"),
        ruleMaxPrice: paise(form, "ruleMaxPrice"),
        ruleOnSale: bool(form, "ruleOnSale"),
        productIds: opt(form, "productIds"),
        sortOrder: int(form, "sortOrder"),
        isActive: bool(form, "isActive"),
        seoTitle: opt(form, "seoTitle"),
        seoDescription: opt(form, "seoDescription"),
      });
    });
    if (err) return fail(err);
    if (!id) go("/admin/collections");
    return done("Collection saved.");
  });
}

export async function deleteCollection(form: FormData) {
  await run(() => mutateContent((d) => drop(d.collections, str(form, "id"))));
  go("/admin/collections");
}

/* ───────── Offers (sales) ───────── */

export async function saveOffer(_: FormState, form: FormData): Promise<FormState> {
  return guard(async () => {
    const id = opt(form, "id");
    const name = str(form, "name");
    const kind = str(form, "kind") === "flat" ? "flat" : "percent";
    const appliesTo = str(form, "appliesTo") as Offer["appliesTo"];
    if (!["all", "category", "collection", "metal", "products"].includes(appliesTo)) return fail("Choose what the offer applies to.");
    const rawValue = parseFloat(str(form, "value"));
    if (!name) return fail("Name is required.");
    if (!Number.isFinite(rawValue) || rawValue <= 0) return fail("Enter a discount value.");
    if (kind === "percent" && rawValue > 90) return fail("Percentage discounts are limited to 90%.");
    const target = appliesTo === "all" ? null : opt(form, `target_${appliesTo}`);
    if (appliesTo !== "all" && !target) return fail("Choose the target for this offer.");
    await mutateContent((d) => {
      upsert<Offer>(d.offers, id, {
        name,
        kind,
        value: kind === "percent" ? Math.round(rawValue) : rupeesToPaise(rawValue),
        appliesTo,
        target,
        startsAt: date(form, "startsAt"),
        endsAt: date(form, "endsAt"),
        isActive: bool(form, "isActive"),
      });
    });
    if (!id) go("/admin/offers");
    return done("Offer saved.");
  });
}

export async function deleteOffer(form: FormData) {
  await run(() => mutateContent((d) => drop(d.offers, str(form, "id"))));
  go("/admin/offers");
}

/* ───────── Banners ───────── */

const PLACEMENTS = ["hero", "promo", "collections", "recipient", "occasion", "category", "look", "instagram"] as const;

export async function saveBanner(_: FormState, form: FormData): Promise<FormState> {
  return guard(async () => {
    const id = opt(form, "id");
    const placement = str(form, "placement") as Banner["placement"];
    if (!PLACEMENTS.includes(placement)) return fail("Choose a placement.");
    const image = str(form, "image");
    if (!image) return fail("Image is required.");
    const meta = opt(form, "meta");
    if (meta) {
      try {
        JSON.parse(meta);
      } catch {
        return fail("Advanced data must be valid JSON.");
      }
    }
    const align = str(form, "align");
    await mutateContent((d) => {
      upsert<Banner>(d.banners, id, {
        placement,
        title: opt(form, "title"),
        subtitle: opt(form, "subtitle"),
        ctaLabel: opt(form, "ctaLabel"),
        href: opt(form, "href"),
        image,
        mobileImage: opt(form, "mobileImage"),
        align: (["left", "center", "right"].includes(align) ? align : "left") as Banner["align"],
        theme: "dark",
        meta,
        sortOrder: int(form, "sortOrder"),
        isActive: bool(form, "isActive"),
      });
    });
    if (!id) go("/admin/banners");
    return done("Banner saved.");
  });
}

export async function deleteBanner(form: FormData) {
  await run(() => mutateContent((d) => drop(d.banners, str(form, "id"))));
  go("/admin/banners");
}

/* ───────── Testimonials ───────── */

export async function saveTestimonial(_: FormState, form: FormData): Promise<FormState> {
  return guard(async () => {
    const id = opt(form, "id");
    const name = str(form, "name");
    const quote = str(form, "quote");
    if (!name || quote.length < 10) return fail("Name and quote (10+ characters) are required.");
    await mutateContent((d) => {
      upsert<Testimonial>(d.testimonials, id, {
        name,
        quote,
        location: opt(form, "location"),
        avatar: opt(form, "avatar"),
        sortOrder: int(form, "sortOrder"),
        isActive: bool(form, "isActive"),
      });
    });
    if (!id) go("/admin/testimonials");
    return done("Testimonial saved.");
  });
}

export async function deleteTestimonial(form: FormData) {
  await run(() => mutateContent((d) => drop(d.testimonials, str(form, "id"))));
  go("/admin/testimonials");
}

/* ───────── Reviews ─────────
 * New reviews wait in the `reviews` collection; approving copies them into site/content (public). */

export async function listPendingReviews(): Promise<Review[]> {
  const snap = await getDocs(collection(db(), "reviews"));
  return snap.docs.map((d) => revive({ ...(d.data() as Omit<Review, "id">), id: d.id }));
}

export async function moderateReview(form: FormData) {
  const id = str(form, "id");
  const action = str(form, "action");
  await run(async () => {
    const ref = doc(db(), "reviews", id);
    if (action === "approve") {
      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      // site/content is public: never publish the reviewer's email or account id
      const { email: _email, uid: _uid, ...pub } = snap.data() as Omit<Review, "id"> & { uid?: string };
      const r = revive({ ...pub, email: "", id, isApproved: true }) as Review;
      await mutateContent((d) => {
        drop(d.reviews, id);
        d.reviews.push(r);
      });
      await deleteDoc(ref);
    } else if (action === "unapprove") {
      let r: Review | undefined;
      await mutateContent((d) => {
        r = d.reviews.find((x) => x.id === id);
        drop(d.reviews, id);
      });
      if (r) await setDoc(ref, { ...r, isApproved: false, createdAt: r.createdAt.getTime() });
    } else {
      await mutateContent((d) => drop(d.reviews, id));
      await deleteDoc(ref);
    }
    window.dispatchEvent(new Event("aj:data"));
  });
}

/* ───────── Subscribers ───────── */

export async function listSubscribers() {
  const snap = await getDocs(collection(db(), "subscribers"));
  return snap.docs
    .map((d) => revive({ ...(d.data() as { email: string; createdAt: number }), id: d.id }) as unknown as { id: string; email: string; createdAt: Date })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function deleteSubscriber(form: FormData) {
  await run(() => deleteDoc(doc(db(), "subscribers", str(form, "id"))));
  window.dispatchEvent(new Event("aj:data"));
}

/* ───────── Enquiries (contact form + product enquiries) ───────── */

export type Enquiry = { id: string; name: string; email: string; phone: string; message: string; product: string; page: string; status: "new" | "contacted" | "closed"; notes: string; createdAt: Date; kind?: import("./store").EnquiryKind; when?: string; photo?: string };

export async function listEnquiries(): Promise<Enquiry[]> {
  const snap = await getDocs(collection(db(), "enquiries"));
  return snap.docs
    .map((d) => revive({ ...d.data(), id: d.id }) as unknown as Enquiry)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function updateEnquiry(_: FormState, form: FormData): Promise<FormState> {
  return guard(async () => {
    const status = str(form, "status");
    if (!["new", "contacted", "closed"].includes(status)) return fail("Pick a status.");
    await updateDoc(doc(db(), "enquiries", str(form, "id")), { status, notes: str(form, "notes").slice(0, 2000) });
    window.dispatchEvent(new Event("aj:data"));
    return done();
  });
}

export async function deleteEnquiry(form: FormData) {
  await run(() => deleteDoc(doc(db(), "enquiries", str(form, "id"))));
  window.dispatchEvent(new Event("aj:data"));
}

/* ───────── Admin access (Google accounts allowed into this panel) ───────── */

export async function listAdmins() {
  const snap = await getDocs(collection(db(), "admins"));
  return snap.docs.map((d) => ({ email: d.id, addedBy: (d.data().addedBy as string) ?? "" }));
}

export async function addAdmin(_: FormState, form: FormData): Promise<FormState> {
  return guard(async () => {
    const raw = str(form, "email");
    // admins/<id>: a Google account email (lower-case) or a phone number in +91… form
    const id = raw.includes("@") ? raw.toLowerCase() : toE164(raw);
    if (!id || (id.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id))) return fail("Enter a Google account email or a mobile number.");
    const me = auth().currentUser;
    await setDoc(doc(db(), "admins", id), { addedBy: me?.email ?? me?.phoneNumber ?? "", createdAt: Date.now() });
    window.dispatchEvent(new Event("aj:data"));
    return done(`${id} can now sign in to the admin panel.`);
  });
}

export async function removeAdmin(form: FormData) {
  const email = str(form, "email");
  const me = auth().currentUser;
  if (email === me?.email?.toLowerCase() || email === me?.phoneNumber) return alert("You can't remove your own access.");
  await run(() => deleteDoc(doc(db(), "admins", email)));
  window.dispatchEvent(new Event("aj:data"));
}

/* ───────── Media upload (stored in Firestore — the free plan has no Cloud Storage) ───────── */

/** Resizes to ≤1600px WebP in the browser and stores it as media/<id>. Returns "media:<id>". */
export async function uploadImage(file: File): Promise<string> {
  const data = await compressImage(file);
  const ref = await addDoc(collection(db(), "media"), { data, name: file.name.slice(0, 120), createdAt: Date.now() });
  return `media:${ref.id}`;
}

/** Products still carrying the first import's template description ("<name> from the Arihant Jewellers collection…"). */
export const hasTemplateCopy = isTemplateCopy;

/** Copies the rewritten descriptions from /seed/catalog.json, only onto products nobody has edited since import. */
export async function applyProductCopy(): Promise<FormState> {
  return guard(async () => {
    const seed = (await fetch("/seed/catalog.json").then((r) => r.json())) as { products: Product[] };
    const byId = new Map(seed.products.map((p) => [p.id, p]));
    let n = 0;
    await mutateCatalog((d) => {
      n = 0;
      for (const p of d.products) {
        const s = byId.get(p.id);
        if (!s || !hasTemplateCopy(p)) continue;
        p.description = s.description;
        p.seoDescription ||= s.seoDescription;
        n++;
      }
    });
    return done(`Updated ${n} product descriptions.`);
  });
}

/* ───────── One-time starter import (dashboard shows it only while the store is empty) ───────── */

export async function importStarterCatalogue(): Promise<FormState> {
  return guard(async () => {
    const [catalog, content] = await Promise.all(["catalog", "content"].map((n) => fetch(`/seed/${n}.json`).then((r) => r.json())));
    let skipped = false;
    // Content first, products last: the dashboard hides this card once products exist.
    await mutateContent((d) => {
      if (d.categories.length) return void (skipped = true);
      Object.assign(d, revive(content));
    });
    await mutateCatalog((d) => {
      if (d.products.length) return void (skipped = true);
      d.products = revive(catalog.products);
    });
    return skipped ? fail("The store already has data, so nothing was overwritten.") : done("Starter catalogue loaded.");
  });
}

/* ───────── Settings ───────── */

const lines = (v: string) =>
  v
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

const trust = (v: string): TrustItem[] =>
  lines(v).map((l) => {
    const [icon, ...rest] = l.split("|");
    return rest.length ? { icon: icon.trim(), label: rest.join("|").trim() } : { icon: "purity", label: icon.trim() };
  });

export async function saveStoreSettings(_: FormState, form: FormData): Promise<FormState> {
  return guard(async () => {
    const current = await getRawSettings();
    const faqs = str(form, "faqs")
      .split(/\n\s*\n/)
      .map((block) => {
        const [q, ...a] = block.trim().split(/\r?\n/);
        return { q: (q ?? "").replace(/^Q:\s*/i, "").trim(), a: a.join(" ").replace(/^A:\s*/i, "").trim() };
      })
      .filter((f) => f.q && f.a);
    const next: Partial<StoreSettings> = {
      storeName: str(form, "storeName") || current.storeName,
      legalName: str(form, "legalName") || current.legalName,
      tagline: str(form, "tagline"),
      email: str(form, "email"),
      phone: str(form, "phone"),
      whatsapp: str(form, "whatsapp"),
      web3formsKey: str(form, "web3formsKey"),
      address: String(form.get("address") ?? "").trim(),
      mapUrl: str(form, "mapUrl"),
      hours: str(form, "hours"),
      gstin: str(form, "gstin").toUpperCase(),
      announcements: lines(str(form, "announcements")),
      social: {
        instagram: str(form, "instagram"),
        facebook: str(form, "facebook"),
        youtube: str(form, "youtube"),
        x: str(form, "x"),
        pinterest: str(form, "pinterest"),
      },
      instagramHandle: str(form, "instagramHandle").replace(/^@/, ""),
      googleProfileUrl: str(form, "googleProfileUrl"),
      googleReviewUrl: str(form, "googleReviewUrl"),
      googleRating: str(form, "googleRating").replace(/[^\d.]/g, "").slice(0, 3),
      googleReviewCount: str(form, "googleReviewCount").replace(/\D/g, ""),
      gaId: str(form, "gaId").toUpperCase(),
      metaPixelId: str(form, "metaPixelId").replace(/\D/g, ""),
      searchConsoleCode: str(form, "searchConsoleCode").replace(/^.*content="([^"]+)".*$/, "$1"),
      popularSearches: lines(str(form, "popularSearches")),
      trustBadges: trust(str(form, "trustBadges")),
      serviceBadges: trust(str(form, "serviceBadges")),
      aboutTitle: str(form, "aboutTitle") || current.aboutTitle,
      aboutText: str(form, "aboutText"),
      aboutPage: String(form.get("aboutPage") ?? "").trim(),
      schemeDetails: String(form.get("schemeDetails") ?? "").trim(),
      faqs,
      policies: Object.fromEntries(
        (Object.keys(DEFAULT_POLICIES) as PolicySlug[]).map((k) => {
          const v = String(form.get(`policy_${k}`) ?? "").replace(/\r\n/g, "\n").trim();
          // Keep the template (empty value) when unchanged so the checklist knows it hasn't been reviewed.
          return [k, v === DEFAULT_POLICIES[k].trim() ? "" : v];
        }),
      ),
    };
    await saveSettings(next);
    return done("Settings saved.");
  });
}

/* ───────── Metal & Gold Rates ───────── */

export async function saveGoldRatesAction(_: FormState, form: FormData): Promise<FormState> {
  return guard(async () => {
    const gold24k = int(form, "gold24k", 14699);
    const gold22k = int(form, "gold22k", 13474);
    if (gold24k <= 0 || gold22k <= 0) return fail("Gold rates must be positive numbers.");
    await saveMetalRates({
      gold24k,
      gold22k,
      gold18k: int(form, "gold18k", 11024),
      gold14k: int(form, "gold14k", 8574),
      silver: int(form, "silver", 200),
      benchmark24k: int(form, "benchmark24k", 7500),
      benchmark22k: int(form, "benchmark22k", 6875),
      benchmark18k: int(form, "benchmark18k", 5625),
      benchmark14k: int(form, "benchmark14k", 4375),
      benchmarkSilver: int(form, "benchmarkSilver", 90),
      enabled: bool(form, "enabled"),
      source: "manual",
    });
    return done("Live metal rates updated successfully. Product prices adjusted.");
  });
}

export async function syncLiveBullionRatesAction(): Promise<FormState> {
  return guard(async () => {
    await fetchLiveMarketRates();
    return done("Market bullion rates refreshed and synced.");
  });
}
