"use client";

import { collection, doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";

/** Same protections as The Growth Bureau site, adapted for a site with no server:
 *  honeypot, 3-second minimum, ≤2 links, a per-browser limit (5/hour per form),
 *  and a site-wide gap between submissions enforced by firestore.rules (see throttle/*). */
export type Form = "reviews" | "subscribers" | "enquiries";

const MIN_MS = 3000;
const PER_HOUR = 5;
const LINK = /https?:\/\/|www\./gi;

export type Verdict = "ok" | "bot" | "links" | "limit";

export function screen(form: FormData, kind: Form, text = ""): Verdict {
  if (form.get("company")) return "bot"; // honeypot
  const t = Number(form.get("t"));
  if (!t || Date.now() - t < MIN_MS) return "bot";
  if ((text.match(LINK) ?? []).length > 2) return "links";
  if (recent(kind).length >= PER_HOUR) return "limit";
  return "ok";
}

function recent(kind: Form): number[] {
  try {
    const hourAgo = Date.now() - 3600_000;
    return (JSON.parse(localStorage.getItem(`aj-sent-${kind}`) || "[]") as number[]).filter((x) => x > hourAgo);
  } catch {
    return [];
  }
}

function remember(kind: Form) {
  try {
    localStorage.setItem(`aj-sent-${kind}`, JSON.stringify([...recent(kind), Date.now()]));
  } catch {}
}

/** Writes the document together with throttle/<kind>; the rules refuse it if another
 *  submission landed a few seconds ago. Returns false when throttled. */
export async function throttledAdd(kind: Form, data: Record<string, unknown>): Promise<boolean> {
  const ref = doc(collection(db(), kind));
  const b = writeBatch(db());
  b.set(ref, data);
  b.set(doc(db(), "throttle", kind), { last: serverTimestamp(), ref: ref.id });
  try {
    await b.commit();
  } catch (e) {
    if ((e as { code?: string }).code === "permission-denied") return false;
    throw e;
  }
  remember(kind);
  return true;
}

export const MESSAGES: Record<Exclude<Verdict, "ok">, string> & { busy: string } = {
  bot: "",
  links: "Please remove the links from your message (two at most).",
  limit: "You've sent a few of these already. Please try again in an hour, or message us on WhatsApp.",
  busy: "We're receiving a lot of messages right now. Please try again in a few seconds.",
};
