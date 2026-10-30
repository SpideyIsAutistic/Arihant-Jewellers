"use client";

type W = Window & { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void };

/** Sends a lead event to Google Analytics and the Meta Pixel, if they're set up in Settings. */
export function trackLead(kind: string) {
  const w = window as W;
  w.gtag?.("event", "generate_lead", { lead_type: kind });
  w.fbq?.("track", "Lead", { content_name: kind });
}
