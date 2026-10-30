"use client";

import dynamic from "next/dynamic";

const QuickView = dynamic(() => import("@/components/product/QuickView").then((m) => m.QuickView));
const CustomerLogin = dynamic(() => import("./CustomerLogin").then((m) => m.CustomerLogin), { ssr: false });

export function StoreOverlays() {
  return (
    <>
      <QuickView />
      <CustomerLogin />
    </>
  );
}
