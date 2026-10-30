"use client";

import { useEffect } from "react";
import type { StoreSettings } from "@/lib/settings";

const add = (src: string) => {
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
};

/** Google Analytics 4 and Meta Pixel, loaded only when their IDs are set in Admin → Settings. */
export function Analytics({ s }: { s: Pick<StoreSettings, "gaId" | "metaPixelId"> }) {
  const ga = /^G-[A-Z0-9]{4,}$/.test(s.gaId) ? s.gaId : "";
  const pixel = /^\d{6,20}$/.test(s.metaPixelId) ? s.metaPixelId : "";
  useEffect(() => {
    const w = window as unknown as Record<string, unknown> & { dataLayer: unknown[] };
    if (ga && !w.gtag) {
      w.dataLayer = w.dataLayer || [];
      // eslint-disable-next-line prefer-rest-params
      w.gtag = function () { w.dataLayer.push(arguments); };
      (w.gtag as (...a: unknown[]) => void)("js", new Date());
      (w.gtag as (...a: unknown[]) => void)("config", ga);
      add(`https://www.googletagmanager.com/gtag/js?id=${ga}`);
    }
    if (pixel && !w.fbq) {
      const q: unknown[] = [];
      const fbq = Object.assign((...a: unknown[]) => q.push(a), { queue: q, loaded: true, version: "2.0", push: (...a: unknown[]) => q.push(a) });
      w.fbq = fbq;
      w._fbq = fbq;
      fbq("init", pixel);
      fbq("track", "PageView");
      add("https://connect.facebook.net/en_US/fbevents.js");
    }
  }, [ga, pixel]);
  return null;
}
