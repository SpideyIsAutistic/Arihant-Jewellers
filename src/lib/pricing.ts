import type { Collection, Offer } from "@/db/schema";
import { splitList } from "./utils";
import { getMetalPriceAdjustment, rateBasedPrice, type MetalRates } from "./gold-rates";

export type PricedInput = {
  id: string;
  price: number;
  compareAtPrice: number | null;
  categoryId: string | null;
  metal: string;
  tags: string;
  purity?: string | null;
  weightGrams?: number | null;
  makingPct?: number | null;
  stoneValue?: number | null;
  name?: string;
};

export type PriceInfo = {
  price: number;
  compareAt: number | null;
  discountPct: number;
  offerName: string | null;
};

export function isOfferLive(o: Pick<Offer, "isActive" | "startsAt" | "endsAt">, now = new Date()) {
  if (!o.isActive) return false;
  if (o.startsAt && o.startsAt > now) return false;
  if (o.endsAt && o.endsAt < now) return false;
  return true;
}

/** Whether a product satisfies a collection's rules (ignores manual picks unless listed). */
export function matchesCollection(p: PricedInput, c: Collection, effectivePrice?: number, onSale?: boolean) {
  const manual = splitList(c.productIds);
  if (manual.includes(p.id)) return true;
  const hasRule =
    !!c.ruleTag || !!c.ruleMetal || !!c.ruleCategoryId || c.ruleMinPrice != null || c.ruleMaxPrice != null || c.ruleOnSale;
  if (!hasRule) return false;
  if (c.ruleTag && !splitList(p.tags).includes(c.ruleTag)) return false;
  if (c.ruleMetal && p.metal.toLowerCase() !== c.ruleMetal.toLowerCase()) return false;
  if (c.ruleCategoryId && p.categoryId !== c.ruleCategoryId) return false;
  const price = effectivePrice ?? p.price;
  if (c.ruleMinPrice != null && price < c.ruleMinPrice) return false;
  if (c.ruleMaxPrice != null && price > c.ruleMaxPrice) return false;
  if (c.ruleOnSale && !onSale) return false;
  return true;
}

function offerApplies(o: Offer, p: PricedInput, collectionsById: Map<string, Collection>) {
  switch (o.appliesTo) {
    case "all":
      return true;
    case "category":
      return !!o.target && p.categoryId === o.target;
    case "metal":
      return !!o.target && p.metal.toLowerCase() === o.target.toLowerCase();
    case "products":
      return splitList(o.target).includes(p.id);
    case "collection": {
      const c = o.target ? collectionsById.get(o.target) : undefined;
      return !!c && matchesCollection(p, c);
    }
    default:
      return false;
  }
}

/** Applies the live metal rates and single best live offer to a product's base price. */
export function priceProduct(
  p: PricedInput,
  offers: Offer[],
  collectionsById: Map<string, Collection> = new Map(),
  priceDelta = 0,
  metalRates?: MetalRates,
): PriceInfo {
  const formula = metalRates ? rateBasedPrice(p, metalRates) : null;
  const metalAdjustment = metalRates && p.price > 0 ? getMetalPriceAdjustment(p, metalRates) : 0;
  const base = formula ? formula.total + priceDelta : Math.max(0, p.price + priceDelta + metalAdjustment);
  let best = 0;
  let bestName: string | null = null;
  for (const o of offers) {
    if (!isOfferLive(o) || !offerApplies(o, p, collectionsById)) continue;
    const off = o.kind === "percent" ? Math.round((base * Math.min(o.value, 95)) / 100) : Math.min(o.value, base - 100);
    if (off > best) {
      best = off;
      bestName = o.name;
    }
  }
  const price = base - best;
  const mrp = p.compareAtPrice ? p.compareAtPrice + priceDelta + metalAdjustment : null;
  const compareAt = best > 0 ? Math.max(base, mrp ?? base) : mrp && mrp > base ? mrp : null;
  const discountPct = compareAt ? Math.round(((compareAt - price) / compareAt) * 100) : 0;
  return { price, compareAt, discountPct, offerName: bestName };
}
