"use client";

import dynamic from "next/dynamic";
import { CookieConsent } from "./CookieConsent";

const QuickView = dynamic(() => import("@/components/product/QuickView").then((m) => m.QuickView));
const CustomerLogin = dynamic(() => import("./CustomerLogin").then((m) => m.CustomerLogin));

export function StoreOverlays() {
  return (
    <>
      <QuickView />
      <CustomerLogin />
      <CookieConsent />
    </>
  );
}
