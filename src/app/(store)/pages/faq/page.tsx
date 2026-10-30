import type { Metadata } from "next";
import { getServerSettings } from "@/lib/server-catalog";
import { absoluteUrl } from "@/lib/utils";
import FaqClient from "./client";

export const metadata: Metadata = {
  title: "Jewellery FAQs",
  description:
    "Find answers to questions about ordering jewellery, BIS hallmarked gold, WhatsApp enquiries, pricing, custom designs, and delivery.",
  alternates: { canonical: absoluteUrl("/pages/faq") },
  openGraph: {
    title: "Frequently Asked Questions | Arihant Jewellers",
    description: "Questions about ordering jewellery, hallmarked gold, WhatsApp enquiries, and pricing in Thane.",
    url: absoluteUrl("/pages/faq"),
    images: [{ url: "/og/default.jpg", width: 1200, height: 630, alt: "Arihant Jewellers bridal gold necklaces" }],
  },
};

export default function FaqPage() {
  const settings = getServerSettings();
  return <FaqClient initialSettings={settings} />;
}
