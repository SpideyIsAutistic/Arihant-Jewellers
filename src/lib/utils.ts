import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function absoluteUrl(path = "/") {
  let base = process.env.NEXT_PUBLIC_SITE_URL;
  if (!base || (process.env.NODE_ENV === "production" && base.includes("localhost"))) {
    base = "https://arihant-jewellers-9dffa.web.app";
  }
  base = base.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function isValidIndianPhone(phone: string): boolean {
  return /^(\+91[\s-]?)?[6-9]\d{9}$/.test(phone.replace(/\s+/g, ""));
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode.trim());
}

export function randomToken(length = 32): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";
  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);
  for (let i = 0; i < length; i++) {
    token += chars[randomBytes[i] % chars.length];
  }
  return token;
}

export function splitList(raw?: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Indian mobile or international number → E.164 ("+919876543210"), or null if it doesn't look like one. */
export function toE164(input: string): string | null {
  const v = input.replace(/[\s()-]/g, "");
  if (/^\d{10}$/.test(v)) return `+91${v}`;
  if (/^(91|0)\d{10}$/.test(v)) return `+91${v.slice(-10)}`;
  return /^\+\d{10,15}$/.test(v) ? v : null;
}
