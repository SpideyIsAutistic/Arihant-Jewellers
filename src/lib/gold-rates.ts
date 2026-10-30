import { loadSite, mutateContent } from "./data";

export type MetalRates = {
  gold24k: number; // ₹ per gram (99.9% 24 Karat Pure Gold)
  gold22k: number; // ₹ per gram (91.6% 22 Karat Hallmarked Gold)
  gold18k: number; // ₹ per gram (75.0% 18 Karat Gold)
  gold14k: number; // ₹ per gram (58.5% 14 Karat Gold)
  silver: number; // ₹ per gram (99.9% Pure Silver)
  change24h: number; // Percentage change (+0.40 or -0.32)
  lastUpdated: string; // ISO date string
  benchmark24k: number; // Base reference rate used for seeded catalog prices
  benchmark22k: number;
  benchmark18k: number;
  benchmark14k: number;
  benchmarkSilver: number;
  enabled: boolean; // Whether live dynamic pricing is enabled
  source?: "market" | "manual" | "google";
};

/** Current live market rates sourced from Google Finance (₹/g) */
export const DEFAULT_METAL_RATES: MetalRates = {
  gold24k: 14699, // ₹14,699 / g (₹1,46,990 / 10g) via Google Finance
  gold22k: 13474, // ₹13,474 / g (₹1,34,740 / 10g) via Google Finance
  gold18k: 11024, // ₹11,024 / g (₹1,10,240 / 10g) via Google Finance
  gold14k: 8574, // ₹8,574 / g (₹85,740 / 10g) via Google Finance
  silver: 200, // ₹200 / g (₹2,00,000 / 1kg) via Google Finance
  change24h: 0.4,
  lastUpdated: "", // empty until the store saves real rates; the site hides rates until then
  benchmark24k: 7500,
  benchmark22k: 6875,
  benchmark18k: 5625,
  benchmark14k: 4375,
  benchmarkSilver: 90,
  enabled: true,
  source: "google",
};

/** Hours since the store last saved rates (Infinity if never). */
export const ratesAgeHours = (r: Pick<MetalRates, "lastUpdated">) => (r.lastUpdated ? (Date.now() - Date.parse(r.lastUpdated)) / 3_600_000 : Infinity);

/** Retrieve current metal rates, with fallback to defaults */
export async function getMetalRates(fresh = false): Promise<MetalRates> {
  try {
    const site = await loadSite(fresh);
    return { ...DEFAULT_METAL_RATES, ...(site.metalRates ?? {}) };
  } catch {
    return DEFAULT_METAL_RATES;
  }
}

/** Save metal rates (admin) */
export async function saveMetalRates(rates: Partial<MetalRates>) {
  let merged: MetalRates = DEFAULT_METAL_RATES;
  await mutateContent((d) => {
    merged = { ...DEFAULT_METAL_RATES, ...(d.metalRates ?? {}), ...rates, lastUpdated: new Date().toISOString() };
    d.metalRates = merged;
  });
  return merged;
}

/** Detect purity from purity string and product name */
export function getProductPurityKey(
  purity: string | null | undefined,
  name = "",
): "24k" | "22k" | "18k" | "14k" | "silver" {
  const s = `${purity || ""} ${name}`.toUpperCase();
  if (s.includes("24K") || s.includes("999") || s.includes("24 KARAT")) return "24k";
  if (s.includes("18K") || s.includes("750") || s.includes("18 KARAT")) return "18k";
  if (s.includes("14K") || s.includes("585") || s.includes("14 KARAT")) return "14k";
  if (s.includes("925") || s.includes("SILVER") || s.includes("STERLING")) return "silver";
  return "22k"; // standard Indian gold jewellery default
}

/**
 * Calculates the dynamic price adjustment (in paise) for a product based on current gold rates.
 * Formula: weightGrams * (currentRate - benchmarkRate) * 1.03 (incl 3% GST)
 */
export function getMetalPriceAdjustment(
  product: {
    metal: string;
    purity?: string | null;
    weightGrams?: number | null;
    name?: string;
  },
  rates: MetalRates,
): number {
  if (!rates.enabled || !product.weightGrams || product.weightGrams <= 0) return 0;
  const isGold = product.metal.toLowerCase() === "gold";
  if (!isGold) return 0;

  const purityKey = getProductPurityKey(product.purity, product.name);
  let currentRate = rates.gold22k;
  let baseRate = rates.benchmark22k;

  if (purityKey === "24k") {
    currentRate = rates.gold24k;
    baseRate = rates.benchmark24k;
  } else if (purityKey === "18k") {
    currentRate = rates.gold18k;
    baseRate = rates.benchmark18k;
  } else if (purityKey === "14k") {
    currentRate = rates.gold14k;
    baseRate = rates.benchmark14k;
  }

  const rateDelta = currentRate - baseRate;
  // Weight in grams * delta in ₹/g * 1.03 (3% GST)
  const deltaRupees = product.weightGrams * rateDelta * 1.03;
  return Math.round(deltaRupees * 100); // in paise
}

export type MetalPriceBreakup = {
  purity: string;
  ratePerGram: number; // in ₹
  grossWeight: number; // in g
  goldValue: number; // in ₹
  makingCharges: number; // in ₹
  gst: number; // in ₹
  totalPrice: number; // in ₹
  rateDeltaPerGram: number; // in ₹
  isLive: boolean;
};

/** Provides full transparent price breakup for gold jewellery */
export function getProductPriceBreakup(
  product: {
    price: number;
    metal: string;
    purity?: string | null;
    weightGrams?: number | null;
    name?: string;
  },
  effectivePricePaise: number,
  rates: MetalRates,
): MetalPriceBreakup | null {
  if (product.metal.toLowerCase() !== "gold" || !product.weightGrams) return null;
  const purityKey = getProductPurityKey(product.purity, product.name);
  const purityLabels: Record<string, string> = {
    "24k": "24K (99.9% Pure Gold)",
    "22k": "22K (91.6% Hallmarked Gold)",
    "18k": "18K (75.0% Gold)",
    "14k": "14K (58.5% Gold)",
  };
  const purityName = purityLabels[purityKey] || "22K Gold";

  const ratePerGram =
    purityKey === "24k"
      ? rates.gold24k
      : purityKey === "18k"
      ? rates.gold18k
      : purityKey === "14k"
      ? rates.gold14k
      : rates.gold22k;

  const baseRate =
    purityKey === "24k"
      ? rates.benchmark24k
      : purityKey === "18k"
      ? rates.benchmark18k
      : purityKey === "14k"
      ? rates.benchmark14k
      : rates.benchmark22k;

  const grossWeight = product.weightGrams;
  const goldValue = Math.round(grossWeight * ratePerGram);
  const totalRupees = Math.round(effectivePricePaise / 100);
  const preGstTotal = Math.round(totalRupees / 1.03);
  const gst = totalRupees - preGstTotal;
  const makingCharges = Math.max(0, preGstTotal - goldValue);

  return {
    purity: purityName,
    ratePerGram,
    grossWeight,
    goldValue,
    makingCharges,
    gst,
    totalPrice: totalRupees,
    rateDeltaPerGram: ratePerGram - baseRate,
    isLive: rates.enabled,
  };
}

/**
 * Fetches live gold (USD/oz) and USD→INR from public CORS-enabled APIs, derives ₹/g for each karat
 * and saves them. Runs in the admin's browser (the site has no server).
 */
export async function fetchLiveMarketRates(): Promise<MetalRates> {
  const current = await getMetalRates(true);
  const json = async (url: string) => {
    const r = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!r.ok) throw new Error(url);
    return r.json();
  };
  const [gold, silver, fx] = await Promise.allSettled([
    json("https://api.gold-api.com/price/XAU"),
    json("https://api.gold-api.com/price/XAG"),
    json("https://open.er-api.com/v6/latest/USD"),
  ]);
  if (gold.status !== "fulfilled" || fx.status !== "fulfilled") throw new Error("Could not reach the market-rate services. Try again or enter rates manually.");
  const usdPerOz = Number(gold.value.price);
  const usdInr = Number(fx.value.rates?.INR);
  if (!usdPerOz || !usdInr) throw new Error("Market-rate services returned no data.");
  // Troy oz → g, plus ~15% Indian import duty & cess to approximate retail bullion rates
  const gold24k = Math.round(((usdPerOz * usdInr) / 31.1034768) * 1.15);
  const silverUsd = silver.status === "fulfilled" ? Number(silver.value.price) : 0;
  return saveMetalRates({
    ...current,
    gold24k,
    gold22k: Math.round(gold24k * (22 / 24)),
    gold18k: Math.round(gold24k * (18 / 24)),
    gold14k: Math.round(gold24k * (14 / 24)),
    silver: silverUsd ? Math.round(((silverUsd * usdInr) / 31.1034768) * 1.15) : current.silver,
    source: "market",
  });
}
