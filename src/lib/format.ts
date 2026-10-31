const inr = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const inrShort = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** Formats paise as "₹ 2,362.50" (reference style). */
export function formatPrice(paise: number) {
  if (!paise) return "Price on request";
  return `₹ ${inr.format(paise / 100)}`;
}

/** Formats paise as "₹2,363" (no decimals) for compact labels. */
export function formatPriceShort(paise: number) {
  if (!paise) return "On request";
  return `₹${inrShort.format(Math.round(paise / 100))}`;
}

export function rupeesToPaise(rupees: number | string) {
  const n = typeof rupees === "string" ? parseFloat(rupees) : rupees;
  return Math.round((Number.isFinite(n) ? n : 0) * 100);
}

export function paiseToRupees(paise: number | null | undefined) {
  if (paise == null) return "";
  return (paise / 100).toFixed(2).replace(/\.00$/, "");
}

export function formatDate(d: Date | number | string, opts?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-IN", opts ?? { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(d),
  );
}

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending_payment: "Awaiting payment",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
