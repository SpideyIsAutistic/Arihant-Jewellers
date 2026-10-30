import type { Metadata } from "next";
import { getServerSettings } from "@/lib/server-catalog";
import { absoluteUrl } from "@/lib/utils";
import AboutClient from "./client";

export const metadata: Metadata = {
  title: "About Us | The Arihant Story",
  description:
    "Learn about Arihant Jewellers, Thane — our heritage of craftsmanship, hallmarked gold purity, and personalized service.",
  alternates: { canonical: absoluteUrl("/pages/about") },
  openGraph: {
    title: "About Us | Arihant Jewellers",
    description: "Our heritage of craftsmanship, hallmarked gold purity, and personalized service in Thane.",
    url: absoluteUrl("/pages/about"),
    images: [{ url: "/og/default.jpg", width: 1200, height: 630, alt: "Arihant Jewellers bridal gold necklaces" }],
  },
};

export default function AboutPage() {
  const settings = getServerSettings();
  return <AboutClient initialSettings={settings} />;
}
