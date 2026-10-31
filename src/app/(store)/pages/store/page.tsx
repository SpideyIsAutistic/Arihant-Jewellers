import type { Metadata } from "next";
import { getServerSettings } from "@/lib/server-catalog";
import { absoluteUrl } from "@/lib/utils";
import StoreClient from "./client";

export const metadata: Metadata = {
  title: "Jewellery Showroom in Thane West",
  description:
    "Visit our jewellery showroom in Thane West, Maharashtra. Explore our gold necklaces, mangalsutras, diamond rings, and precious gemstones in person.",
  alternates: { canonical: absoluteUrl("/pages/store") },
  openGraph: {
    title: "Our Showroom | Arihant Jewellers Thane West",
    description: "Visit our jewellery showroom on Ghodbunder Road, Thane West. Gold, diamond, and gemstone jewellery.",
    url: absoluteUrl("/pages/store"),
    images: [{ url: "/og/showroom.jpg", width: 1200, height: 630, alt: "Arihant Jewellers Showroom" }],
  },
};

export default function StorePage() {
  const settings = getServerSettings();
  return <StoreClient initialSettings={settings} />;
}
