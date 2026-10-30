import { loadSite, mutateContent } from "./data";

export type TrustItem = { icon: string; label: string };

export type StoreSettings = {
  storeName: string;
  legalName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  /** Web3Forms access key — contact & product enquiry forms email the address it was created for. */
  web3formsKey: string;
  address: string;
  mapUrl: string;
  hours: string;
  gstin: string;
  foundedYear: string;
  announcements: string[];
  freeShippingThreshold: number; // paise, 0 = always charge shipping fee
  shippingFee: number; // paise
  giftWrapFee: number; // paise
  codEnabled: boolean;
  codMaxOrder: number; // paise
  deliveryDaysMin: number;
  deliveryDaysMax: number;
  returnDays: number;
  social: { instagram: string; facebook: string; youtube: string; x: string; pinterest: string };
  instagramHandle: string;
  /** Google Business Profile: listing link, "write a review" link, and the rating shown on the site (updated by hand). */
  googleProfileUrl: string;
  googleReviewUrl: string;
  googleRating: string;
  googleReviewCount: string;
  /** Google Analytics 4 measurement ID (G-…), Meta Pixel ID, Search Console HTML-tag verification code. */
  gaId: string;
  metaPixelId: string;
  searchConsoleCode: string;
  popularSearches: string[];
  trustBadges: TrustItem[];
  serviceBadges: TrustItem[];
  aboutTitle: string;
  aboutText: string;
  aboutPage: string;
  /** Gold savings scheme terms shown on /pages/gold-savings-scheme (blank = "ask us"). */
  schemeDetails: string;
  faqs: { q: string; a: string }[];
  policies: Partial<Record<"shipping-policy" | "refund-policy" | "privacy-policy" | "terms-of-service", string>>;
};

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "Arihant Jewellers",
  legalName: "Arihant Jewellers",
  tagline: "Jewellery for every moment",
  email: "arihantjewellers2005@gmail.com",
  phone: "",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "",
  web3formsKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "",
  address: "Beside Bank of Baroda Waghbill, Shop no.8-G,Vijay Apt,Phase-3 Ghodbunder road, Waghbil Naka Flyover, Thane West, Thane, Maharashtra 400615",
  mapUrl: "https://www.google.com/maps/place/?q=place_id:ChIJBeh1Juu75zsR-NzD5q8_zqA",
  hours: "Mon – Sun: 10:00 AM – 2:00 PM, 5:00 PM – 9:30 PM",
  gstin: "",
  foundedYear: "2005",
  announcements: [
    "Explore the Arihant catalogue — enquire on WhatsApp for prices & availability",
    "Visit our showroom in Thane West",
    "Custom & made-to-order pieces available",
  ],
  freeShippingThreshold: 199900,
  shippingFee: 9900,
  giftWrapFee: 4900,
  codEnabled: true,
  codMaxOrder: 2500000,
  deliveryDaysMin: 3,
  deliveryDaysMax: 7,
  returnDays: 7,
  social: { instagram: "https://www.instagram.com/arihant_jewellers_2005/", facebook: "", youtube: "", x: "", pinterest: "" },
  instagramHandle: "arihant_jewellers_2005",
  googleProfileUrl: "https://www.google.com/maps/place/?q=place_id:ChIJBeh1Juu75zsR-NzD5q8_zqA",
  googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJBeh1Juu75zsR-NzD5q8_zqA",
  googleRating: "4.8",
  googleReviewCount: "305",
  gaId: "",
  metaPixelId: "",
  searchConsoleCode: "",
  popularSearches: ["Diamond Rings", "Mangalsutra", "Gold Chain", "Emerald", "Bridal Necklace", "Men's Rings", "Yellow Sapphire", "Necklace Set"],
  trustBadges: [
    { icon: "purity", label: "Certified Purity" },
    { icon: "quality", label: "Quality Checked" },
    { icon: "gift", label: "Gift Ready Packaging" },
    { icon: "support", label: "Personal Assistance" },
  ],
  serviceBadges: [
    { icon: "store", label: "Visit Our Showroom" },
    { icon: "support", label: "WhatsApp Assistance" },
    { icon: "purity", label: "Hallmarked Gold" },
    { icon: "quality", label: "Expert Craftsmanship" },
    { icon: "gift", label: "Custom Orders" },
  ],
  aboutTitle: "The Arihant Story",
  aboutText:
    "Jewellery carries more than shine — it carries moments. At Arihant Jewellers in Thane every piece is chosen for its craftsmanship and honest purity: gold necklaces and mangalsutras, diamond rings and sets, precious gemstones and silver for the home temple.",
  aboutPage: `## Our story
Arihant Jewellers brings together traditional craftsmanship and contemporary design. From everyday gold chains to bridal necklace sets, from diamond cocktail rings to certified gemstones, every piece in our collection is selected for quality, comfort and honest value.

## What we stand for
- Hallmarked gold and purity you can trust
- Transparent pricing, linked to the day's metal rate
- Personal guidance — before and after your purchase

## Visit us
We would love to welcome you at our showroom in Thane West. Find our address and opening hours on the Store page, or message us on WhatsApp any time.`,
  schemeDetails: "",
  faqs: [
    { q: "Can I buy jewellery directly on this website?", a: "This website is our catalogue. Tap “Enquire on WhatsApp” or send an enquiry on any product and our team will confirm the price, availability and how to purchase — usually within a few hours." },
    { q: "Why do some pieces say “Price on request”?", a: "Gold prices change every day with the metal rate, and many pieces are one-of-a-kind. Ask us on WhatsApp and we'll share today's price and weight." },
    { q: "Is your gold hallmarked?", a: "Yes. Our gold jewellery is BIS hallmarked and purity is stated for every piece. Silver pieces are listed with their purity under Specifications." },
    { q: "Can I see a piece before buying?", a: "Of course — visit our showroom, or ask us for more photos or a video call on WhatsApp." },
    { q: "Do you make custom or made-to-order jewellery?", a: "Yes. Share a reference photo or idea on WhatsApp and we'll guide you on design, weight and timelines." },
    { q: "How do I find my ring or bangle size?", a: "Ring sizes follow the Indian sizing scale and bangles are offered in 2.4, 2.6 and 2.8. If you are unsure, contact us and we will help you choose." },
    { q: "How should I care for my jewellery?", a: "Store pieces separately in a dry pouch, avoid perfume and water, and wipe gently with a soft cloth after wearing. Silver can be refreshed with a polishing cloth." },
  ],
  policies: {},
};

/** Settings exactly as stored (tokens such as {freeShipping} left intact) — for the admin editor. */
export async function getRawSettings(): Promise<StoreSettings> {
  const site = await loadSite(true);
  return { ...DEFAULT_SETTINGS, ...(site.settings as Partial<StoreSettings>) };
}

export async function getSettings(): Promise<StoreSettings> {
  try {
    const site = await loadSite();
    return applyTokens({ ...DEFAULT_SETTINGS, ...(site.settings as Partial<StoreSettings>) });
  } catch {
    return applyTokens(DEFAULT_SETTINGS);
  }
}

/** Replaces {freeShipping} in customer-facing strings with the configured threshold. */
function applyTokens(s: StoreSettings): StoreSettings {
  const fs = `₹${Math.round(s.freeShippingThreshold / 100).toLocaleString("en-IN")}`;
  const rep = (t: string) => t.replaceAll("{freeShipping}", fs);
  const hasFree = s.freeShippingThreshold > 0;
  return {
    ...s,
    announcements: s.announcements.filter((a) => hasFree || !a.includes("{freeShipping}")).map(rep),
    trustBadges: s.trustBadges.filter((b) => hasFree || !b.label.includes("{freeShipping}")).map((b) => ({ ...b, label: rep(b.label) })),
    serviceBadges: s.serviceBadges.filter((b) => hasFree || !b.label.includes("{freeShipping}")).map((b) => ({ ...b, label: rep(b.label) })),
  };
}

export async function saveSettings(values: Partial<StoreSettings>) {
  return mutateContent((d) => {
    d.settings = { ...d.settings, ...values };
  });
}
