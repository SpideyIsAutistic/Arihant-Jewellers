"use client";

import { z } from "zod";
import { MESSAGES, recentCount, screen, throttledAdd } from "@/lib/spam";
import { auth } from "@/lib/firebase";
import { trackLead } from "@/lib/analytics";
import {
  applyFilters,
  getCardsByIds,
  parseFilterParams,
  resolveListing,
  searchCatalog,
  sortCards,
  type ProductCard,
} from "@/lib/catalog";
import { priceProduct } from "@/lib/pricing";
import { getCatalog } from "@/lib/catalog";
import { loadSite } from "@/lib/data";
import { getSettings } from "@/lib/settings";

export type FormState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
} | null;

/* ───────── Catalogue helpers for client components ───────── */

export async function loadMoreProducts(
  slug: string | null,
  query: Record<string, string>,
  offset: number,
  limit = 24,
): Promise<ProductCard[]> {
  const safeOffset = Math.max(0, Math.floor(offset));
  const safeLimit = Math.min(48, Math.max(1, Math.floor(limit)));
  const f = parseFilterParams(query);
  if (slug) {
    const listing = await resolveListing(slug);
    if (!listing) return [];
    return applyFilters(listing.items, f).items.slice(
      safeOffset,
      safeOffset + safeLimit,
    );
  }
  const q = String(query.q ?? "");
  const { items } = await searchCatalog(q);
  const sorted = f.sort === "relevance" ? items : sortCards(items, f.sort);
  return applyFilters(sorted, { ...f, q: "", sort: "none" }).items.slice(
    safeOffset,
    safeOffset + safeLimit,
  );
}

export async function getProductCards(ids: string[]) {
  return getCardsByIds(ids.slice(0, 24));
}

export async function getQuickView(productId: string) {
  const site = await loadSite();
  const p = site.products.find((x) => x.id === productId);
  if (!p || !p.isActive) return null;
  const { offers, collections, metalRates } = await getCatalog();
  const byId = new Map(collections.map((c) => [c.id, c]));
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    image: p.images[0]?.url ?? null,
    variants: p.variants.map((v) => {
      const pr = priceProduct(p, offers, byId, v.priceDelta, metalRates);
      return {
        id: v.id,
        title: v.title,
        stock: v.stock,
        price: pr.price,
        compareAt: pr.compareAt,
        discountPct: pr.discountPct,
      };
    }),
  };
}

/* ───────── Newsletter (stored in Firestore, admin can export) ───────── */

const emailSchema = z.string().trim().toLowerCase().email().max(200);

export async function subscribeNewsletter(
  _: FormState,
  form: FormData,
): Promise<FormState> {
  const parsed = emailSchema.safeParse(form.get("email"));
  if (!parsed.success)
    return { ok: false, message: "Please enter a valid email address." };
  const thanks: FormState = {
    ok: true,
    message:
      "Thank you for subscribing! You'll hear about new arrivals and offers first.",
  };
  const v = screen(form, "subscribers");
  if (v === "bot") return thanks; // silently dropped, like The Growth Bureau site
  if (v !== "ok") return { ok: false, message: MESSAGES[v] };
  try {
    if (
      !(await throttledAdd("subscribers", {
        email: parsed.data,
        createdAt: Date.now(),
      }))
    )
      return { ok: false, message: MESSAGES.busy };
  } catch {
    return { ok: false, message: "Something went wrong. Please try again." };
  }
  return thanks;
}

/* ───────── Contact & product enquiries → saved in Firestore (Admin → Enquiries) + emailed via Web3Forms ───────── */

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(200),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Please write a little more (10+ characters)")
    .max(4000),
  product: z.string().trim().max(300).optional().or(z.literal("")),
});

/** Showroom visit / video call requests: same inbox as enquiries, plus type and preferred slot. */
export const APPOINTMENT_KINDS = { visit: "Showroom visit", video: "Video call" } as const;
/** Every enquiry type shown as a badge in Admin → Enquiries. */
export const ENQUIRY_KINDS = {
  ...APPOINTMENT_KINDS,
  exchange: "Old gold exchange",
  scheme: "Savings scheme",
  custom: "Custom design",
  notify: "Notify when available",
} as const;
export type EnquiryKind = keyof typeof ENQUIRY_KINDS;
const photoSchema = z.string().startsWith("data:image/").max(450_000, "That photo is too large. Please try a smaller one.");
const appointmentSchema = z.object({
  kind: z.enum(["visit", "video"], { message: "Choose a showroom visit or a video call" }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date"),
  time: z.string().trim().min(1, "Choose a time").max(20),
  phone: z.string().trim().regex(/^[+\d][\d\s-]{7,18}$/, "Please enter a phone number we can call to confirm"),
});

async function web3forms(payload: Record<string, string>) {
  const key =
    (await getSettings()).web3formsKey.trim() ||
    process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
  if (!key) throw new Error("Web3Forms access key is not configured.");
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: key,
      from_name: "Arihant Jewellers website",
      botcheck: "",
      ...payload,
    }),
  });
  const data = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
  };
  if (!res.ok || !data.success)
    throw new Error(data.message || "Could not send");
}

export async function sendContactMessage(
  _: FormState,
  form: FormData,
): Promise<FormState> {
  const fields = Object.fromEntries(form) as Record<string, string>;
  const kind = (fields.kind in ENQUIRY_KINDS ? fields.kind : null) as EnquiryKind | null;
  const booking = kind === "visit" || kind === "video" ? appointmentSchema.safeParse(fields) : null;
  const photo = fields.photo ? photoSchema.safeParse(fields.photo) : null;
  if (booking && !fields.message?.trim()) // the note is optional for appointments
    fields.message = `${APPOINTMENT_KINDS[fields.kind as keyof typeof APPOINTMENT_KINDS] ?? "Appointment"} request for ${fields.date}, ${fields.time}.`;
  const parsed = contactSchema.safeParse(fields);
  if (!parsed.success || (booking && !booking.success) || (photo && !photo.success)) {
    const errors: Record<string, string> = {};
    for (const i of [...(parsed.error?.issues ?? []), ...(booking?.error?.issues ?? [])]) errors[String(i.path[0])] = i.message;
    if (photo && !photo.success) errors.photo = photo.error.issues[0].message;
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      errors,
    };
  }
  const d = parsed.data;
  const b = booking?.data;
  const when = b ? `${new Date(`${b.date}T00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}, ${b.time}` : "";
  const done: FormState = {
    ok: true,
    message: b
      ? `Thank you! We've received your ${APPOINTMENT_KINDS[b.kind].toLowerCase()} request for ${when}. We'll call you to confirm.`
      : kind
      ? `Thank you! We've received your ${ENQUIRY_KINDS[kind].toLowerCase()} request and will get back to you shortly.`
      : d.product
      ? "Thank you! We've received your enquiry and will get back to you shortly."
      : "Thank you for reaching out. Our team will get back to you shortly.",
  };
  const v = screen(form, "enquiries", d.message);
  if (v === "bot") return done;
  if (v !== "ok") return { ok: false, message: MESSAGES[v] };
  const page = d.product ? window.location.href.slice(0, 500) : "";
  try {
    const saved = await throttledAdd("enquiries", {
      name: d.name,
      email: d.email,
      phone: d.phone || "",
      message: d.message,
      product: d.product || "",
      page,
      status: "new",
      notes: "",
      createdAt: Date.now(),
      uid: auth().currentUser?.uid ?? "",
      ...(kind ? { kind } : {}),
      ...(b ? { when } : {}),
      ...(photo?.success ? { photo: photo.data } : {}),
    });
    if (!saved) return { ok: false, message: MESSAGES.busy };
  } catch {
    return {
      ok: false,
      message:
        "Sorry, your message couldn't be sent. Please try WhatsApp or call us.",
    };
  }
  // Saved; the email is best-effort (the enquiry is in Admin → Enquiries either way).
  await web3forms({
    subject: b
      ? `${APPOINTMENT_KINDS[b.kind]} request: ${when} (${d.name})`
      : kind
        ? `${ENQUIRY_KINDS[kind]}: ${d.product || d.name}${photo?.success ? " (photo in admin panel)" : ""}`
        : d.product
        ? `Product enquiry: ${d.product}`
        : `New website enquiry from ${d.name}`,
    ...(b ? { appointment: `${APPOINTMENT_KINDS[b.kind]}, ${when}` } : {}),
    name: d.name,
    email: d.email,
    phone: d.phone || "—",
    replyto: d.email,
    ...(d.product ? { product: d.product, page } : {}),
    message: d.message,
  }).catch(() => {});
  trackLead(kind ?? (d.product ? "product" : "contact"));
  return done;
}

/* ───────── Reviews (held for approval in the admin panel) ───────── */

const reviewSchema = z.object({
  productId: z.string().min(1),
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Please enter a valid email").max(200),
  rating: z.coerce.number().int().min(1, "Please choose a rating").max(5),
  title: z.string().trim().max(120).optional().or(z.literal("")),
  body: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters")
    .max(3000),
});

export async function submitReview(
  _: FormState,
  form: FormData,
): Promise<FormState> {
  const parsed = reviewSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0])] = i.message;
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      errors,
    };
  }
  const d = parsed.data;
  const thanks: FormState = {
    ok: true,
    message:
      "Thank you! Your review has been submitted and will appear once approved.",
  };
  const v = screen(form, "reviews", `${d.title ?? ""} ${d.body}`);
  if (v === "bot") return thanks;
  if (v !== "ok") return { ok: false, message: MESSAGES[v] };
  try {
    const saved = await throttledAdd("reviews", {
      productId: d.productId,
      name: d.name,
      email: d.email,
      rating: d.rating,
      title: d.title || null,
      body: d.body,
      isApproved: false,
      createdAt: Date.now(),
      uid: auth().currentUser?.uid ?? "",
    });
    if (!saved) return { ok: false, message: MESSAGES.busy };
  } catch {
    return { ok: false, message: "Something went wrong. Please try again." };
  }
  return thanks;
}

/** "Notify me when it's back" for a sold-out piece: one tap, uses the signed-in visitor's details. */
export async function requestNotify(product: string): Promise<FormState> {
  const u = auth().currentUser;
  if (!u?.email) return { ok: false, message: "Please sign in first." };
  if (recentCount("enquiries") >= 5) return { ok: false, message: MESSAGES.limit };
  try {
    const saved = await throttledAdd("enquiries", {
      name: (u.displayName || u.email.split("@")[0]).slice(0, 100).padEnd(2, "."),
      email: u.email,
      phone: "",
      message: `Please let me know when ${product} is available again.`.slice(0, 4000),
      product: product.slice(0, 300),
      page: window.location.href.slice(0, 500),
      status: "new",
      notes: "",
      createdAt: Date.now(),
      uid: u.uid,
      kind: "notify",
    });
    if (!saved) return { ok: false, message: MESSAGES.busy };
  } catch {
    return { ok: false, message: "Something went wrong. Please try WhatsApp instead." };
  }
  trackLead("notify");
  return { ok: true, message: "Done! We'll let you know as soon as it's back." };
}
